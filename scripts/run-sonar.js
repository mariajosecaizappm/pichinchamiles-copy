const scanner = require('sonarqube-scanner').default;
const { execSync } = require('child_process');

// Debug: Try to find any branch names in the environment
const allEnvKeysWithBranch = Object.keys(process.env).filter(k =>
    process.env[k] && typeof process.env[k] === 'string' && process.env[k].includes('feature')
);
console.log("Environment variables containing the branch name:", allEnvKeysWithBranch.map(k => `${k}=${process.env[k]}`));

let currentBranch = process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || process.env.BUILD_SOURCEBRANCHNAME || process.env.GITHUB_REF_NAME;

if (!currentBranch) {
    try {
        currentBranch = execSync('git log -1 --pretty=%D').toString().trim();
        const gitBranchMatch = currentBranch.match(/feature\/[^\s,]+/);
        if (gitBranchMatch) {
            currentBranch = gitBranchMatch[0];
        } else {
            currentBranch = "master";
        }
    } catch (error) {
        currentBranch = "master";
    }
}

if (!currentBranch || currentBranch === 'HEAD') currentBranch = "master";

const serverUrl = process.env.SONAR_HOST_URL || "https://sonarqb.ppm.com.ec/";
const token = process.env.SONAR_TOKEN;
const projectKey = process.env.SONAR_PROJECT_KEY || "frontend-base-template";

const cfAccessClientId = process.env.CF_ACCESS_CLIENT_ID;
const cfAccessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;

const options = {
    "sonar.projectKey": projectKey,
    "sonar.sources": "src",
    "sonar.tests": "src",
    "sonar.test.inclusions": "**/*.test.*",
    "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
    "sonar.sourceEncoding": "UTF-8",
    "sonar.javascript.node.maxspace": "4096",
    "sonar.token": token,
    "sonar.exclusions": "**/node_modules/**,**/coverage/**,**/.next/**,**/.open-next/**,**/dist/**,**/public/**,**/__test__/**,**/__mocks__/**,**/*.svg",
    "sonar.javascript.exclusions": "**/node_modules/**,**/coverage/**,**/.next/**,**/.open-next/**,**/dist/**,**/public/**,**/__test__/**",
};

// Cloudflare Access headers
if (cfAccessClientId && cfAccessClientSecret) {
    options["sonar.http.extraHeaders"] = `CF-Access-Client-Id: ${cfAccessClientId}, CF-Access-Client-Secret: ${cfAccessClientSecret}`;
}

if (!token) {
    console.warn("⚠️ SONAR_TOKEN environment variable is not set. Skipping SonarQube scan.");
    process.exit(0);
}

// Try to resolve Pull Request ID dynamically
(async () => {
    let prId = process.env.SYSTEM_PULLREQUEST_PULLREQUESTID ||
        process.env.CF_PAGES_PULL_REQUEST_ID ||
        process.env.GITHUB_PR_NUMBER ||
        (process.env.GITHUB_REF && process.env.GITHUB_REF.match(/refs\/pull\/(\d+)/) ? process.env.GITHUB_REF.match(/refs\/pull\/(\d+)/)[1] : null);

    if (!prId && currentBranch && currentBranch !== 'master' && currentBranch !== 'main') {
        console.log("Attempting to auto-discover Pull Request ID from GitHub API...");
        try {
            // Determine Repo from git
            const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
            let repoPath = "publipromueve/frontend-base-template"; // Fallback static
            const sshMatch = remoteUrl.match(/github\.com:(.+\/.+)\.git/);
            const httpsMatch = remoteUrl.match(/github\.com\/(.+\/.+)\.git/);
            if (sshMatch) repoPath = sshMatch[1];
            else if (httpsMatch) repoPath = httpsMatch[1];

            const githubToken = process.env.GITHUB_TOKEN;
            const headers = { "User-Agent": "cloudflared-build-sonar" };
            if (githubToken) headers["Authorization"] = `token ${githubToken}`;

            const safeBranch = encodeURIComponent(`${repoPath.split('/')[0]}:${currentBranch}`);
            const res = await fetch(`https://api.github.com/repos/${repoPath}/pulls?state=open&head=${safeBranch}`, { headers });

            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    prId = data[0].number.toString();
                    console.log(`Successfully discovered PR #${prId} for branch ${currentBranch}`);
                }
            } else {
                console.log("GitHub API request failed or returned unauthorized (Need GITHUB_TOKEN if private). Status:", res.status);
            }
        } catch (err) {
            console.log("Failed to discover PR ID via GitHub API:", err.message);
        }
    }

    if (prId) {
        console.log(`====> SONAR WILL USE PULL REQUEST: ${prId} (Branch: ${currentBranch})`);
        options["sonar.pullrequest.key"] = prId;
        options["sonar.pullrequest.branch"] = currentBranch;
        options["sonar.pullrequest.base"] = "master";
    } else {
        console.log("====> SONAR WILL USE BRANCH:", currentBranch);
        options["sonar.branch.name"] = currentBranch;
    }

    scanner(
        {
            serverUrl: serverUrl,
            token: token,
            options: options,
        },
        () => {
            console.log("SonarQube scan completed.");
            process.exit(0);
        }
    );
})();
