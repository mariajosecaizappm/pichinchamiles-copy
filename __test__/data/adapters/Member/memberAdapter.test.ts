import { describe, it, expect } from "vitest";
import { capitalize, memberInformationAdapter, memberOtpInformationAdapter } from "@/data/adapters/Member/memberAdapter";
import { MemberType, Member, UnformattedPersonalMember, UnformattedCorporateMember, MemberSecurityUpdate } from "@/domain/entity/Member/member";
import { Address } from "@/domain/entity/Address/structure/address";

describe("capitalize", () => {
    it("should capitalize first letter and lowercase the rest", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("WORLD")).toBe("World");
        expect(capitalize("HeLLo")).toBe("Hello");
    });

    it("should handle single character", () => {
        expect(capitalize("a")).toBe("A");
        expect(capitalize("Z")).toBe("Z");
    });

    it("should handle empty string", () => {
        expect(capitalize("")).toBe("");
    });

    it("should handle strings with spaces", () => {
        expect(capitalize("new york")).toBe("New york");
        expect(capitalize("LOS ANGELES")).toBe("Los angeles");
    });
});

describe("memberInformationAdapter", () => {
    const mockPersonalMember: UnformattedPersonalMember = {
        memberType: "personal",
        acceptLopd: true,
        acceptedTermsAndCondition: true,
        address: "123 Main St",
        birthDay: "1990-01-01",
        city: "new york",
        country: "USA",
        cellPhone: "+1234567890",
        enrollmentEmail: "test@example.com",
        gender: "M",
        state: "new york",
        identification: "123456789",
        identificationType: "passport",
        firstName: "john",
        secondName: "paul",
        firstLastName: "doe",
        secondLastName: "smith",
        phone: "+1234567890",
        registrationDate: "2023-01-01T00:00:00Z",
    };

    const mockCorporateMember: UnformattedCorporateMember = {
        memberType: "corporate",
        companyName: "ACME Corp",
        identification: "987654321",
        identificationType: "tax_id",
        firstNameAdministrator: "jane",
        secondNameAdministrator: "marie",
        firstLastNameAdministrator: "smith",
        secondLastNameAdministrator: "johnson",
        address: "456 Business Ave",
        acceptLopd: true,
        acceptedTermsAndCondition: true,
        identificationNumberAdministrator: "555666777",
        enrollmentEmailAdministrator: "admin@company.com",
        enrollmentEmail: "company@example.com",
        birthDay: "1985-05-15",
        cellPhone: "+0987654321",
        city: "los angeles",
        country: "USA",
        state: "california",
        registrationDate: "2023-06-15T00:00:00Z",
    };

    describe("personal member adaptation", () => {
        it("should adapt personal member correctly", () => {
            const result = memberInformationAdapter(mockPersonalMember);

            expect(result).toEqual({
                memberType: MemberType.PERSONAL,
                acceptLopd: true,
                acceptedTermsAndCondition: true,
                address: "123 Main St",
                birthDay: "1990-01-01",
                city: "New york",
                country: "Usa",
                cellPhone: "+1234567890",
                enrollmentEmail: "test@example.com",
                gender: "M",
                state: "New york",
                identificationNumber: "123456789",
                identificationType: "passport",
                firstName: "john",
                secondName: "paul",
                firstLastName: "doe",
                secondLastName: "smith",
                phone: "+1234567890",
                registrationDate: "31/12/2022",
                segment: "",
            });
        });

        it("should handle personal member with missing optional fields", () => {
            const minimalPersonalMember = {
                ...mockPersonalMember,
                secondName: "",
                secondLastName: "",
            };

            const result = memberInformationAdapter(minimalPersonalMember) as Member & { secondName: string; secondLastName: string };

            expect(result.secondName).toBe("");
            expect(result.secondLastName).toBe("");
        });
    });

    describe("corporate member adaptation", () => {
        it("should adapt corporate member correctly", () => {
            const result = memberInformationAdapter(mockCorporateMember);

            expect(result).toEqual({
                memberType: MemberType.CORPORATE,
                companyName: "ACME Corp",
                identificationNumber: "987654321",
                identificationType: "tax_id",
                firstNameAdministrator: "jane",
                secondNameAdministrator: "marie",
                firstLastNameAdministrator: "smith",
                secondLastNameAdministrator: "johnson",
                address: "456 Business Ave",
                acceptLopd: true,
                acceptedTermsAndCondition: true,
                identificationNumberAdministrator: "555666777",
                enrollmentEmailAdministrator: "admin@company.com",
                enrollmentEmail: "company@example.com",
                birthDay: "1985-05-15",
                cellPhone: "+0987654321",
                city: "Los angeles",
                country: "Usa",
                state: "California",
                administratorName: "jane marie smith johnson",
                registrationDate: "14/06/2023",
                segment: "",
            });
        });

        it("should build administrator name correctly with missing fields", () => {
            const corporateMemberWithMissingFields = {
                ...mockCorporateMember,
                secondNameAdministrator: "",
                secondLastNameAdministrator: "",
            };

            const result = memberInformationAdapter(corporateMemberWithMissingFields) as Member & { administratorName: string };

            expect(result.administratorName).toBe("jane smith");
        });

        it("should handle corporate member with all administrator fields empty", () => {
            const corporateMemberWithEmptyAdmin = {
                ...mockCorporateMember,
                firstNameAdministrator: "",
                secondNameAdministrator: "",
                firstLastNameAdministrator: "",
                secondLastNameAdministrator: "",
            };

            const result = memberInformationAdapter(corporateMemberWithEmptyAdmin) as Member & { administratorName: string };

            expect(result.administratorName).toBe("");
        });
    });

    describe("date formatting", () => {
        it("should format registration date correctly for personal member", () => {
            const memberWithSpecificDate = {
                ...mockPersonalMember,
                registrationDate: "2023-12-25T15:30:00Z",
            };

            const result = memberInformationAdapter(memberWithSpecificDate);

            expect(result.registrationDate).toBe("25/12/2023");
            expect(result.segment).toBe("");
        });

        it("should format registration date correctly for corporate member", () => {
            const memberWithSpecificDate = {
                ...mockCorporateMember,
                registrationDate: "2023-07-04T09:15:00Z",
            };

            const result = memberInformationAdapter(memberWithSpecificDate);

            expect(result.registrationDate).toBe("04/07/2023");
            expect(result.segment).toBe("");
        });
    });

    describe("capitalization of location fields", () => {
        it("should capitalize city, country, and state fields", () => {
            const memberWithUppercaseLocation = {
                ...mockPersonalMember,
                city: "CHICAGO",
                country: "UNITED STATES",
                state: "ILLINOIS",
            };

            const result = memberInformationAdapter(memberWithUppercaseLocation);

            expect(result.city).toBe("Chicago");
            expect(result.country).toBe("United states");
            expect(result.state).toBe("Illinois");
            expect(result.segment).toBe("");
        });
    });
});

describe("memberOtpInformationAdapter", () => {
    const mockAddress = (overrides: Partial<Address> = {}): Address => ({
        id: "addr-1",
        alias: "Home",
        street1: "Main St",
        street2: "Apt 4B",
        country: { id: "country-1", name: "Ecuador", grade: "country", parentId: null },
        state: { id: "state-1", name: "Pichincha", grade: "state", parentId: "country-1" },
        city: { id: "city-1", name: "Quito", grade: "city", parentId: "state-1" },
        zone: { id: "zone-1", name: "Centro", grade: "zone", parentId: "city-1" },
        number: "123",
        reference: "Near park",
        isThirdPartyAddress: false,
        customerReceivingFirstName: "",
        customerReceivingLastName: "",
        customerReceivingEmail: "",
        customerReceivingPhone: "",
        customerReceivingIdentificationNumber: "",
        customerReceivingIdentificationType: "",
        secondPhone: "0999999999",
        postalCode: "170101",
        default: true,
        ...overrides,
    });

    it("returns memberSecurityUpdate unchanged when address is not provided", () => {
        const memberSecurityUpdate: MemberSecurityUpdate = {
            mfaCode: "123456",
            mfaToken: "token-abc",
            enrollmentEmail: "user@example.com",
        };

        const result = memberOtpInformationAdapter(memberSecurityUpdate);

        expect(result).toBe(memberSecurityUpdate);
        expect(result).toEqual({
            mfaCode: "123456",
            mfaToken: "token-abc",
            enrollmentEmail: "user@example.com",
        });
    });

    it("formats address without third party fields and without addressId when id is missing", () => {
        const address = mockAddress({ id: "" });
        const memberSecurityUpdate: MemberSecurityUpdate = {
            mfaCode: "654321",
            mfaToken: "token-xyz",
            address,
        };

        const result = memberOtpInformationAdapter(memberSecurityUpdate);

        expect(result).toEqual({
            mfaCode: "654321",
            mfaToken: "token-xyz",
            address: {
                reference: "Near park",
                street1: "Main St",
                street2: "Apt 4B",
                number: "123",
                addressName: "Home",
                secondPhone: "0999999999",
                alias: "Home",
                isThirdPartyAddress: false,
                default: true,
                countryLocationId: "country-1",
                stateLocationId: "state-1",
                cityLocationId: "city-1",
                zoneLocationId: "zone-1",
            },
        });
        expect((result as { address: Record<string, unknown> }).address).not.toHaveProperty("addressId");
        expect((result as { address: Record<string, unknown> }).address).not.toHaveProperty("customerReceivingFirstName");
    });

    it("includes addressId when address has id", () => {
        const address = mockAddress({ id: "addr-99" });
        const memberSecurityUpdate: MemberSecurityUpdate = {
            mfaCode: "111111",
            mfaToken: "token-id",
            address,
        };

        const result = memberOtpInformationAdapter(memberSecurityUpdate);

        expect((result as { address: Record<string, unknown> }).address).toEqual(
            expect.objectContaining({
                addressId: "addr-99",
                alias: "Home",
                countryLocationId: "country-1",
            }),
        );
    });

    it("includes third party fields when isThirdPartyAddress is true", () => {
        const address = mockAddress({
            id: "addr-third",
            isThirdPartyAddress: true,
            customerReceivingFirstName: "Jane",
            customerReceivingLastName: "Doe",
            customerReceivingEmail: "jane@example.com",
            customerReceivingPhone: "0987654321",
            customerReceivingIdentificationNumber: "1234567890",
            customerReceivingIdentificationType: "CI",
        });
        const memberSecurityUpdate: MemberSecurityUpdate = {
            mfaCode: "222222",
            mfaToken: "token-third",
            address,
        };

        const result = memberOtpInformationAdapter(memberSecurityUpdate);

        expect((result as { address: Record<string, unknown> }).address).toEqual({
            reference: "Near park",
            street1: "Main St",
            street2: "Apt 4B",
            number: "123",
            addressName: "Home",
            secondPhone: "0999999999",
            alias: "Home",
            isThirdPartyAddress: true,
            default: true,
            countryLocationId: "country-1",
            stateLocationId: "state-1",
            cityLocationId: "city-1",
            zoneLocationId: "zone-1",
            addressId: "addr-third",
            customerReceivingFirstName: "Jane",
            customerReceivingLastName: "Doe",
            customerReceivingEmail: "jane@example.com",
            customerReceivingPhone: "0987654321",
            customerReceivingIdentificationNumber: "1234567890",
            customerReceivingIdentificationType: "CI",
        });
    });
});