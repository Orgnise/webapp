import { ORGNISE_LOGO } from "@/lib/constants";
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

export default function WelcomeEmail({
  name = "John Doe",
  email = "john@doe.io",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Orgnise.in</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={ORGNISE_LOGO}
                height="40"
                alt="Orgnise Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Welcome to Orgnise.in
            </Heading>
            <Section className="my-8">
              {/* <Img src={THUMBNAIL} alt="Orgnise" className="max-w-[500px]" /> */}
            </Section>
            <Text className="text-sm leading-6 text-black">
              Thanks for signing up{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Sonu Sharma, and I&apos;m the founder of Orgnise.in -
              the modern tool for managing your knowledge base. We&apos;re
              excited to have you on board!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Here are a few things you can do:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create a{" "}
              <Link
                href="https://orgnise.in/help/article/how-to-create-a-team"
                className="font-medium text-blue-600 no-underline"
              >
                new team
              </Link>{" "}
              and{" "}
              <Link
                href="https://orgnise.in/help/article/how-to-create-workspace"
                className="font-medium text-blue-600 no-underline"
              >
                add a workspace
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create your first{" "}
              <Link
                href="https://orgnise.in/help/article/what-is-collection"
                className="font-medium text-blue-600 no-underline"
              >
                collection{" "}
              </Link>
              and{" "}
              <Link
                href="https://orgnise.in/help/article/what-is-page"
                className="font-medium text-blue-600 no-underline"
              >
                page
              </Link>
            </Text>

            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I&apos;m always
              happy to help!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Sonu from Orgnise
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
