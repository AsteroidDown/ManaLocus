import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import { Link } from "expo-router";
import moment from "moment";
import { useContext, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function TermsOfService() {
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  return (
    <SafeAreaView
      className="flex flex-1 gap-4 lg:px-48 px-4 py-8 min-h-fit bg-dark-100"
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
      <View className="flex gap-4 min-h-fit">
        <Text size="2xl" weight="bold">
          Terms of Service for ManaLocus
        </Text>

        <Text>Effective Date: Jan 1, 2025</Text>

        <Text>
          Welcome to ManaLocus (the "Site"), a fan-driven, hobby website
          dedicated to celebrating the Magic: The Gathering community and its
          culture. These Terms of Use ("Terms") of ManaLocus LLC and its
          affiliate companies ("ManaLocus," "we," "us," and "our") apply to all
          contents and information available within the domain manalocus.com.
          Please read the following terms and conditions ("Terms of Service" or
          "Agreement") carefully before using the Site.
        </Text>

        <Text>
          By accessing or using the Site, you agree to be bound by these Terms.
          If you do not agree to these Terms, please refrain from using the
          Site.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          1. Acceptance of Terms
        </Text>

        <Text>
          By accessing or using ManaLocus, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service, along
          with any applicable laws and regulations. You also agree to comply
          with any additional guidelines or rules that may be posted on the Site
          from time to time.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          2. No Affiliation with Wizards of the Coast
        </Text>

        <Text>
          Wizards of the Coast, Magic: The Gathering, and their logos are
          trademarks of Wizards of the Coast LLC in the United States and other
          countries. © 1993-{moment().format("yyyy")} Wizards. All Rights
          Reserved.
        </Text>

        <Text>
          ManaLocus is an independent, fan-run website and is not affiliated,
          endorsed, or sponsored by Wizards of the Coast LLC or its parent
          company Hasbro, Inc. The content featured on the Site, including
          images, game rules, and card information, is for educational,
          community-building, and non-commercial purposes. We respect the
          intellectual property of Wizards of the Coast and encourage users to
          do the same.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          3. Intellectual Property Rights
        </Text>

        <View className="flex gap-2 ml-4">
          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Magic: The Gathering is a trademark of Wizards of the Coast, LLC,
              a subsidiary of Hasbro, Inc. All card images, logos, and
              trademarks are the property of Wizards of the Coast and are used
              for reference and commentary purposes only.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Users may not use the trademarks, logos, or card images from
              Magic: The Gathering in any way that is commercial or could cause
              confusion with the official Magic: The Gathering brand.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              The content created by ManaLocus, including but not limited to
              written articles, reviews, fan-created artwork, and original
              guides, is protected by copyright law. You may not reproduce,
              distribute, or otherwise use this content for commercial purposes
              without express written permission from ManaLocus.
            </Text>
          </View>
        </View>

        <Text size="lg" weight="semi" className="mt-4 -mb-2" id="4">
          4. License
        </Text>

        <Text>
          ManaLocus grants you a revocable limited license to access and make
          personal use of the Site subject to these Terms. Notwithstanding
          anything to the contrary, ManaLocus reserves the right to limit,
          restrict or revoke this license and/or use or access to the Site in
          our sole and absolute discretion, for any reason or no reason. The
          Site and any part of it may not be reproduced, copied, framed or
          otherwise exploited for any purpose without the express prior written
          consent of ManaLocus.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          5. User Conduct
        </Text>

        <Text>
          You agree to use the Site in a manner that is lawful and respectful of
          others. Specifically, you agree not to:
        </Text>

        <View className="flex gap-2 ml-4">
          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Engage in any activity that infringes on the intellectual property
              rights of others, including but not limited to, copying,
              distributing, or displaying copyrighted material without proper
              authorization.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Post, upload, or distribute any content that is illegal, harmful,
              defamatory, abusive, or otherwise inappropriate.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use the Site for commercial purposes without prior written consent
              from ManaLocus.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Impersonate any individual or entity or falsely state or otherwise
              misrepresent your affiliation with any individual or entity.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use foul, abusive, discriminatory, offensive, sexual, or hateful
              language on the Site.
            </Text>
          </View>
        </View>

        <Text>
          ManaLocus handles each case of user conduct breech individually and
          will determine the consequences of the violation on a case by case
          basis. Consequences could range anywhere from language deletion to
          account termination. If you would like to appeal one of our decisions,
          please send an email to{" "}
          <Link
            href="mailto:support@manalocus.com"
            className="!text-primary-300"
          >
            support@manalocus.com
          </Link>
          .
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          6. Community Guidelines
        </Text>

        <Text>
          As a fan-driven community, we encourage friendly and constructive
          engagement. Please follow these guidelines when interacting with
          others on the Site:
        </Text>

        <View className="flex gap-2 ml-4">
          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Be respectful and considerate of others and their opinions.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Respect the privacy and security of others. Do not share personal
              information without their consent.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Avoid personal attacks, trolling, or other forms of harassment.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Do not engage in any activity that could be considered spam,
              phishing, or other forms of fraudulent activity.
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Do not engage in any activity that could be considered hate
              speech, discrimination, or harassment.
            </Text>
          </View>
        </View>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          7. Third-Party Links and Content
        </Text>

        <Text>
          The Site may contain links to third-party websites, including but not
          limited to online stores or external content related to Magic: The
          Gathering. These links are provided for your convenience, but
          ManaLocus does not endorse or take responsibility for the content or
          privacy practices of any third-party websites.
        </Text>

        <Text>
          Please understand that those third-party websites and products may
          have different terms of use and privacy policies, and that ManaLocus
          does not control and is not responsible for the content of such
          websites or the privacy practices of such third parties. The
          information collected by such third-party websites is not covered by
          the Privacy Policy.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2" id="8">
          8. Security and Restrictions
        </Text>

        <Text>
          You are prohibited from violating or attempting to violate the
          security of the Site, including, without limitation, by (a) accessing
          data not intended for such user or logging onto a server or an account
          which the user is not authorized to access; (b) attempting to probe,
          scan or test the vulnerability of a system or network or to breach
          security or authentication measures without proper authorization; (c)
          accessing or using the Site or any portion thereof without
          authorization; or (d) introducing any viruses, Trojan horses, worms,
          logic bombs or other material which is malicious or technologically
          harmful.
        </Text>

        <Text>You agree not to use the Site:</Text>

        <View className="flex gap-2 ml-4">
          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              In any way that violates any applicable federal, state, local or
              international law or regulation;
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              To engage in any conduct that restricts or inhibits anyone's use
              or enjoyment of the Site, or which, as determined by us, may harm
              us or users of the Site or expose them to liability;
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use the Site in any manner that could disable, overburden, damage,
              or impair the Site or interfere with any other party's use of the
              Site;
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use any robot, spider or other automatic device, process or means
              to access the Site for any purpose, including monitoring or
              copying any of the material on the Site;
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use any manual process to monitor or copy any of the material on
              the Site or for any other unauthorized purpose without our prior
              written consent;
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Use any device, software or routine that interferes with the
              proper working of the Site; or
            </Text>
          </View>

          <View className="flex flex-row gap-4">
            <View className="w-1.5 h-1.5 mt-2 rounded-full bg-white" />
            <Text className="mt-px">
              Otherwise attempt to interfere with the proper working of the
              Site.
            </Text>
          </View>
        </View>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          9. Privacy
        </Text>

        <Text>
          Your use of the Site is governed by our{" "}
          <Link href="legal/privacy-policy" className="!text-primary-300">
            Privacy Policy
          </Link>
          , which explains how we collect, use, and protect your personal
          information. By using the Site, you agree to the terms of our Privacy
          Policy.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          10. Disclaimer of Warranties
        </Text>

        <Text>
          The content and services provided on ManaLocus are offered "as is" and
          "as available," without any warranty or representation, express or
          implied. We do not guarantee that the Site will be free of errors,
          viruses, or other harmful components. You agree to use the Site at
          your own risk.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          11. Limitation of Liability
        </Text>

        <Text>
          To the fullest extent permitted by applicable law, ManaLocus shall not
          be liable for any direct, indirect, incidental, special,
          consequential, or punitive damages arising out of your use of the
          Site, including but not limited to damages for loss of profits,
          goodwill, or data.
        </Text>

        <Text>
          Your sole remedy for disappointment with the Site, content,
          information contained within the Site, any linked site, or any
          products or services purchased through the Site is to stop using the
          Site and/or those products or services. To the extent any aspects of
          the foregoing limitations of liability are not enforceable, our
          maximum liability to you with respect to your use of this Site and any
          products or services purchased by you through the Site is one hundred
          dollars ($100.00). The foregoing limitations apply even if the
          remedies under these terms of use fail of their essential purpose.
        </Text>

        <Text>
          Any claims arising in connection with your use of the Site or any
          products or services purchased through the Site must be brought within
          one (1) year of the date of the event giving rise to such action
          occurred.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          12. Indemnification
        </Text>

        <Text>
          You agree to indemnify and hold harmless ManaLocus, its affiliates,
          employees, agents, and licensors from any claims, liabilities, losses,
          or damages arising out of or in connection with your use of the Site,
          your violation of these Terms of Service, or your infringement of any
          third-party rights.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          13. Modification of Terms
        </Text>

        <Text>
          ManaLocus reserves the right to update or modify these Terms of
          Service at any time, with or without notice. Changes will be effective
          immediately upon posting on the Site, and your continued use of the
          Site after such changes constitutes your acceptance of the revised
          Terms. We encourage you to return to this webpage frequently so that
          you are aware of our current Terms.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          14. Governing Law
        </Text>

        <Text>
          These Terms of Service shall be governed by and construed in
          accordance with the laws of Ontario. Any disputes arising out of or
          relating to these Terms shall be subject to the exclusive jurisdiction
          of the courts in Ontario.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2" id="15">
          15. Miscellaneous
        </Text>

        <Text>
          You represent and warrant that you shall comply with all laws and
          regulations that apply to your access and use of the Site and any
          Site-related services, including, but not limited to, any applicable
          national laws that prohibit the export or transmission of technical
          data or software to certain territories or jurisdictions.
        </Text>

        <Text>
          We reserve the right to seek all remedies available at law and in
          equity for violations of these Terms, including the right to remove
          your account and any contents generated by you on the Site, block your
          access to the Site, block IP addresses.
        </Text>

        <Text>
          If any provision of these Terms is held to be unenforceable, the
          remaining Terms shall remain in full force and effect, and the
          unenforceable provision shall be replaced by an enforceable provision
          that comes closest to the intention underlying the unenforceable
          provision.
        </Text>

        <Text>
          No waiver by us of any term or condition set forth in these Terms
          shall be deemed a further or continuing waiver of such term or
          condition or a waiver of any other term or condition. Our failure to
          insist upon or enforce strict performance of any provision of these
          Terms shall not be construed as a waiver of any right.
        </Text>

        <Text size="lg" weight="semi" className="mt-4 -mb-2">
          15. Contact Information
        </Text>

        <Text>
          If you have any questions about these Terms of Service or the
          practices of ManaLocus, please contact us at:{" "}
          <Link
            href="mailto:support@manalocus.com"
            className="!text-primary-300"
          >
            support@manalocus.com
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
