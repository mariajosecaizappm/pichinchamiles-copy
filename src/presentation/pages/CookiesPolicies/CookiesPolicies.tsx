
import { ReactElement } from "react";
import { cookiesContent } from './data';
import LegalConditionsLayout from "@/presentation/components/Layout/LegalConditionsLayout";
import List from "@/presentation/components/List";
import CookiePolicyListItem from "./CookiePolicyListItem";

const CookiesPolicies = ():ReactElement => {
    return (
        <LegalConditionsLayout containerClassName="*:base-paragraph [&>p]:font-normal" title="Política de cookies">
            {cookiesContent.map((item, index) => {
                const keyItem = `cookie-item-${index}`;
                return (
                    <div key={keyItem}>
                        <h6 className="mb-5 font-bold">{item.title}</h6>
                        <p className="font-thin">{item.content}</p>
                        {item?.list && (
                            <List items={item.list}
                                className="space-y-5"
                                itemClassName="font-thin"
                                renderItem={(listItem) => (
                                    <CookiePolicyListItem title={listItem.title} description={listItem.description} />
                                )} />
                        )}
                    </div>
                )
            })}
        </LegalConditionsLayout>
    )
}

export default CookiesPolicies