import { ORGNISE_LOGO, getPlanDetails } from "@/lib/constants";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./component/footer";

export default function UpgradeEmail({
  name = "John Doe",
  email = "john@doe.co",
  plan = "Pro",
}: {
  name: string | null;
  email: string;
  plan: string;
}) {
  const planDetails = getPlanDetails(plan);
  return (
    <Html>
      <Head />
      <Preview>Thank you for upgrading to Orgnise.in {plan}!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={ORGNISE_LOGO}
                width="40"
                height="40"
                alt="Orgnise"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Thank you for upgrading to Orgnise.in {plan}!
            </Heading>
            <Section className="my-8">
              <Img
                src="https://images.unsplash.com/photo-1643878037082-ba1fd9a60b16?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Thank you"
                className="max-w-[500px]"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              Hey{name && ` ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Sonu Sharma, and I&apos;m the founder of Orgnise. I
              wanted to personally reach out to thank you for upgrading to{" "}
              <Link
                href={planDetails.link}
                className="font-medium text-blue-600 no-underline"
              >
                Orgnise.in {plan}
              </Link>
              !
            </Text>
            <Text className="text-sm leading-6 text-black">
              As you might already know, we are a{" "}
              <Link
                href="https://x.com/TheAlphaMerc/status/1775217285172793461"
                className="font-medium text-blue-600 no-underline"
              >
                100% bootstrapped
              </Link>{" "}
              and{" "}
              <Link
                href="https://git.new/orgnise"
                className="font-medium text-blue-600 no-underline"
              >
                open-source
              </Link>{" "}
              business. Your support means the world to us and helps us continue
              to build and improve Orgnise.in.
            </Text>
            <Text className="text-sm leading-6 text-black">
              On the {plan} plan, you now have access to:
            </Text>
            {planDetails.features.map((feature, index) => (
              <Text className="ml-1 text-sm leading-4 text-black" key={index}>
                ◆ {feature.text}
              </Text>
            ))}
            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I&apos;m always
              happy to help!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Sonu Sharma from Orgnise
            </Text>
            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
