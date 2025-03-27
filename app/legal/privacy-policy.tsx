import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { Link } from "expo-router";
import { SafeAreaView, View } from "react-native";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-48 px-4 py-4 min-h-fit bg-dark-100">
        <View className="flex gap-4 min-h-fit">
          <Text size="2xl" weight="bold">
            Privacy Policy for ManaLocus
          </Text>

          <Text>Effective Date: Jan 1, 2025</Text>

          <Text>
            At ManaLocus ("we," "our," or "us"), we are committed to protecting
            your privacy and ensuring a safe online experience for all our
            users. This Privacy Policy outlines how we collect, use, and protect
            your personal information when you visit or interact with our
            website{" "}
            <Link href="https://manalocus.com" className="!text-primary-300">
              https://manalocus.com
            </Link>{" "}
            (the "Site"). By using the Site, you agree to the collection and use
            of information in accordance with this Privacy Policy.
          </Text>

          <Text>
            Please review this Privacy Policy carefully.When you submit
            information to or through the Site, you consent to the collection
            and processing of your information as described in this Privacy
            Policy. By using the Site, you accept the terms of this Privacy
            Policy and our Terms of Use, and consent to our collection, use,
            disclosure and retention of your information as described in this
            Privacy Policy. We, and our Site visitors, are bound by laws in the
            United States. If you do not agree with any part of this Privacy
            Policy, you are not authorized to use the Site.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            1. Information We Collect
          </Text>

          <Text>
            We may collect the following types of information when you use the
            Site:
          </Text>

          <Text weight="semi">a. Personal Information</Text>

          <Text>
            Personal information is data that can be used to identify you
            directly or indirectly. This may include, but is not limited to:
          </Text>

          <View className="flex gap-2 ml-4">
            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Name</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Email address</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Username</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Profile picture (if applicable)</Text>
            </View>
          </View>

          <Text weight="semi">a. Personal Information</Text>

          <Text>
            Non-personal information is data that cannot be used to directly
            identify you. This may include:
          </Text>

          <View className="flex gap-2 ml-4">
            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Browser type and version</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">IP address</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Device type (e.g., desktop, mobile)</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Pages visited on the Site</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Referring URLs</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Date and time of visit</Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text className="mt-px">Pages visited on the Site</Text>
            </View>
          </View>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            2. How We Use Your Information
          </Text>

          <Text>
            We use the information we collect for the following purposes:
          </Text>

          <View className="flex gap-2 ml-4">
            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                To provide and maintain the Site:{" "}
                <Text>
                  We use your information to offer you a personalized
                  experience, enhance the functionality of the Site, and ensure
                  it runs smoothly.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                To communicate with you:{" "}
                <Text>
                  We may use your email address to send you updates,
                  newsletters, or important notices about the Site. You may
                  opt-out of these communications at any time by clicking the
                  "unsubscribe" link in the emails or contacting us directly.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                To improve the Site:{" "}
                <Text>
                  We may analyze usage data to understand how users interact
                  with the Site and to improve our content, features, and
                  overall user experience.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                To comply with legal obligations:{" "}
                <Text>
                  If required by law, we may use or disclose your information to
                  comply with applicable legal processes, respond to legal
                  claims, or protect our rights.
                </Text>
              </Text>
            </View>
          </View>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            3. How We Share Your Information
          </Text>

          <Text>
            We do not sell, rent, or trade your personal information to third
            parties. However, we may share your information in the following
            circumstances:
          </Text>

          <View className="flex gap-2 ml-4">
            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Service Providers:{" "}
                <Text>
                  We may share your information with third-party service
                  providers that help us operate and improve the Site (e.g.,
                  hosting providers, email marketing platforms). These service
                  providers are required to protect your information and only
                  use it for the purposes of providing their services.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Legal Requirements:{" "}
                <Text>
                  We may disclose your personal information if required to do so
                  by law or in response to valid legal requests by public
                  authorities (e.g., a court or government agency).
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Business Transfers:{" "}
                <Text>
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred as part of that transaction. We
                  will notify you via email or notice on the Site if such a
                  transfer occurs.
                </Text>
              </Text>
            </View>
          </View>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            4. Data Retention
          </Text>

          <Text>
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law. If you wish
            to delete your account or request that we no longer use your
            information, please contact us at{" "}
            <Link
              href="mailto:support@manalocus.com"
              className="!text-primary-300"
            >
              support@manalocus.com
            </Link>
            .
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            5. Your Data Protection Rights
          </Text>

          <Text>
            Depending on your location, you may have the following rights
            regarding your personal information:
          </Text>

          <View className="flex gap-2 ml-4">
            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Access:{" "}
                <Text>
                  You have the right to request a copy of the personal
                  information we hold about you.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Correction:{" "}
                <Text>
                  You have the right to request corrections to any inaccurate or
                  incomplete personal information we have about you.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Deletion:{" "}
                <Text>
                  You can request the deletion of your personal information,
                  subject to certain legal exceptions.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Objection:{" "}
                <Text>
                  You may object to the processing of your personal information
                  for certain purposes, including marketing.
                </Text>
              </Text>
            </View>

            <View className="flex flex-row gap-4">
              <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
              <Text weight="semi" className="mt-px">
                Portability:{" "}
                <Text>
                  You have the right to request a copy of your data in a
                  structured, commonly used, and machine-readable format.
                </Text>
              </Text>
            </View>
          </View>

          <Text>
            If you wish to exercise any of these rights, please contact us at{" "}
            <Link
              href="mailto:support@manalocus.com"
              className="!text-primary-300"
            >
              support@manalocus.com
            </Link>
            .
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            6. Security of Your Information
          </Text>

          <Text>
            We take the security of your personal information seriously and use
            reasonable administrative, technical, and physical safeguards to
            protect it from unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            method of electronic storage is 100% secure, and we cannot guarantee
            absolute security.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            7. Links to Third-Party Websites
          </Text>

          <Text>
            Our Site may contain links to external websites that are not
            operated by us. We are not responsible for the privacy practices or
            content of these third-party sites. We encourage you to review the
            privacy policies of any websites you visit through links on our
            Site.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            8. Children’s Privacy
          </Text>

          <Text>
            The Site is not intended for use by individuals under the age of 13,
            and we do not knowingly collect personal information from children
            under 13. If we become aware that we have collected personal
            information from a child under 13, we will take steps to delete that
            information as soon as possible. If you believe we have
            inadvertently collected such information, please contact us
            immediately.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            9. International Data Transfers
          </Text>

          <Text>
            If you are accessing the Site from outside Canada, please be aware
            that your information may be transferred to, stored, and processed
            in Canada or other countries where our servers are located. By using
            the Site, you consent to the transfer of your information to
            countries that may have different data protection laws than your
            country of residence.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            10. Changes to This Privacy Policy
          </Text>

          <Text>
            We reserve the right to update or modify this Privacy Policy at any
            time. Any changes will be posted on this page with an updated
            "Effective Date." We encourage you to review this Privacy Policy
            periodically to stay informed about how we are protecting your
            information.
          </Text>

          <Text size="lg" weight="semi" className="mt-4 -mb-2">
            11. Contact Us
          </Text>

          <Text>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:{" "}
            <Link
              href="mailto:support@manalocus.com"
              className="!text-primary-300"
            >
              support@manalocus.com
            </Link>
          </Text>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
