import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const WaitingList = () => {
  return (
    <Html>
      <Head />
      <Preview>Thanks for joining Orgnise waiting list</Preview>
      <Tailwind>
        <Body className="my-auto bg-white font-sans">
          <Section className="my-10 px-2 py-5">
            <Section className="mt-8">
              <Text className="text-sm leading-6 text-black">
                Hello,
                <br />A warm welcome to Orgnise! We&apos;re thrilled to have you
                on board our waiting list.
                <br />
                We&apos;re excited to share our innovated knowledge base
                platform with you, and we can&apos;t wait for you to experience
                it.
              </Text>
            </Section>
            <Heading className="mx-0 mb-1 mt-4 p-0 text-xl font-semibold text-black">
              What&apos;s happening next?
            </Heading>
            <Section>
              <Text className="text-sm leading-6 text-black">
                Our team is working diligently to bring Orgnise to life.
                We&apos;re currently in the development phase, and we&apos;re
                making great progress.
                <br />
                We&apos;ll keep you updated on our progress and let you know as
                soon as we&apos;re ready to launch.
              </Text>
            </Section>
            <Heading className="mx-0 mb-1 mt-4 p-0 text-xl font-semibold text-black">
              Stay connected
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Want to stay up-to-date on our progress? Follow us on social
              media: <Link href="https://twitter.com/orgniseapp">Twitter</Link>,{" "}
              <Link href="https://go.orgnise.in/linkedin">Linkedin</Link>
              <br />
            </Text>
            <br />
            <Heading className="mx-0 mb-1 mt-2 p-0 text-xl font-semibold text-black">
              Get in touch
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Have questions or feedback? We&apos;d love to hear from you.
              Simply reply to this email.
              <br />
              Thank you for your interest in Orgnise. We&apos;re honored to have
              you on this journey with us.
            </Text>
            <br />

            <Text className="mt-4 text-sm font-semibold leading-6 text-black">
              --
              <br />
              Thank you,
              <br />
              Sonu Sharma
              <br />
              Founder Orgnise.in
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WaitingList;
