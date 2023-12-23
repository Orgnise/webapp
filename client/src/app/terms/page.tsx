import React from "react";
import { Editor } from "novel";
import { NavbarLayout } from "@/components/layout/nav-layout";

/**
 * Terms and conditions page
 */
export default function TermsAndConditionPage() {
  return (
    <div className="flex flex-col h-screen bg-default">
      <NavbarLayout>
        {/* <Nav /> */}
        <></>
      </NavbarLayout>
      <div className="flex-1 pointer-events-none">
        <Editor
          key={"privacy-policy"}
          className="shadow-none p-0 m-0"
          // onUpdate={(editor) => {}}
          defaultValue={data}
          disableLocalStorage={true}
        />
      </div>
    </div>
  );
}

const data = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "TERMS AND CONDITIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Last updated December 20, 2023",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "AGREEMENT TO OUR LEGAL TERMS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'We are Pulse ("',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Company",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '," "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "we",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '," "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "us",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '," "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "our",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '").',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We operate the website ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://pulsehq.vercel.app/",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class:
                  "novel-text-stone-400 novel-underline novel-underline-offset-[3px] hover:novel-text-stone-600 novel-transition-colors novel-cursor-pointer",
              },
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 58, 250)",
              },
            },
          ],
          text: "https://pulsehq.vercel.app",
        },
        {
          type: "text",
          text: ' (the "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Site",
        },
        {
          type: "text",
          text: '"), as well as any other related products and services that refer or link to these legal terms (the "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Legal Terms",
        },
        {
          type: "text",
          text: '") (collectively, the "',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Services",
        },
        {
          type: "text",
          text: '").',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Streamline your work with our all-in-one knowledge, doc, and project management system.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You can contact us by email at sonu.sharma045@gmail.com ",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("',
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "you",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '"), and Pulse, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "The Services are intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "We recommend that you print a copy of these Legal Terms for your records.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "TABLE OF CONTENTS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "1. OUR SERVICES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "2. INTELLECTUAL PROPERTY RIGHTS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "3. USER REPRESENTATIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "4. USER REGISTRATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "5. PURCHASES AND PAYMENT",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "6. FREE TRIAL",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "7. CANCELLATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "8. PROHIBITED ACTIVITIES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "9. USER GENERATED CONTRIBUTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "10. CONTRIBUTION LICENSE",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "11. SOCIAL MEDIA",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "12. SERVICES MANAGEMENT",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "13. PRIVACY POLICY",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "14. TERM AND TERMINATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "15. MODIFICATIONS AND INTERRUPTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "16. GOVERNING LAW",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "17. DISPUTE RESOLUTION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "18. CORRECTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "19. DISCLAIMER",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "20. LIMITATIONS OF LIABILITY",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "21. INDEMNIFICATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "22. USER DATA",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "24. CALIFORNIA USERS AND RESIDENTS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "25. MISCELLANEOUS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(48, 48, 241)",
              },
            },
          ],
          text: "26. CONTACT US",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "1. OUR SERVICES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "__________",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "2. INTELLECTUAL PROPERTY RIGHTS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Our intellectual property",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Your use of our Services",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'Subject to your compliance with these Legal Terms, including the "',
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 58, 250)",
              },
            },
          ],
          text: "PROHIBITED ACTIVITIES",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: '" section below, we grant you a non-exclusive, non-transferable, revocable license to:',
        },
      ],
    },
    {
      type: "bulletList",
      attrs: {
        tight: true,
      },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "access the Services; and",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "download or print a copy of any portion of the Content to which you have properly gained access.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "solely for your personal, non-commercial use or internal business purpose.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: sonu.sharma045@gmail.com. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Your submissions",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'Please review this section and the "',
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 58, 250)",
              },
            },
          ],
          text: "PROHIBITED ACTIVITIES",
        },
        {
          type: "text",
          text: '" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Submissions:",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: ' By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You are responsible for what you post or upload:",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: " By sending us Submissions through any part of the Services you:",
        },
      ],
    },
    {
      type: "bulletList",
      attrs: {
        tight: true,
      },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: 'confirm that you have read and agree with our "',
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(0, 58, 250)",
                      },
                    },
                  ],
                  text: "PROHIBITED ACTIVITIES",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: '" and will not post, send, publish, upload, or transmit through the Services any Submission that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;',
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "to the extent permissible by applicable law, waive any and all moral rights to any such Submission;",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "warrant that any such Submission are original to you or that you have the necessary rights and licenses to submit such Submissions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions; and",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "warrant and represent that your Submissions do not constitute confidential information.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "You are solely responsible for your Submissions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party’s intellectual property rights, or (c) applicable law.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "3.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "USER REPRESENTATIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "By using the Services, you represent and warrant that:",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "(1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary;",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "(3) you have the legal capacity and you agree to comply with these Legal Terms;",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "(4) you are not under the age of 13;",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "(5) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (6) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "4.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "USER REGISTRATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "5.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "PURCHASES AND PAYMENT",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We accept the following forms of payment:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. ",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "6. FREE TRIAL",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We offer a 14-day free trial to new users who register with the Services. The account will not be charged and the subscription will be suspended until upgraded to a paid version at the end of the free trial.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "7. CANCELLATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Your cancellation will take effect at the end of the current paid term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "If you are unsatisfied with our Services, please email us at sonu.sharma045@gmail.com.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "8.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "PROHIBITED ACTIVITIES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "As a user of the Services, you agree not to:",
        },
      ],
    },
    {
      type: "bulletList",
      attrs: {
        tight: true,
      },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Use any information obtained from the Services in order to harass, abuse, or harm another person.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Make improper use of our support services or submit false reports of abuse or misconduct.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Use the Services in a manner inconsistent with any applicable laws or regulations.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Engage in unauthorized framing of or linking to the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Delete the copyright or other proprietary rights notice from any Content.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Attempt to impersonate another user or person or use the username of another user.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: 'Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").',
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorized script or other software.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Use a buying agent or purchasing agent to make purchases on the Services.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        color: "rgb(89, 89, 89)",
                      },
                    },
                  ],
                  text: "Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "9.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "USER GENERATED CONTRIBUTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'The Services does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated in accordance with the Services\' Privacy Policy. When you create or make available any Contributions, you thereby represent and warrant that:',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "10.",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: " CONTRIBUTION LICENSE",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You and Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "11.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "SOCIAL MEDIA",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a "Third-Party Account") by either: (1) providing your Third-Party Account login information through the Services; or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account. You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account. By granting us access to any Third-Party Accounts, you understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and stored in your Third-Party Account (the "Social Network Content") so that it is available on and through the Services via your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party Account additional information to the extent you are notified when you link your account with the Third-Party Account. Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through your account on the Services. Please note that if a Third-Party Account or associated service becomes unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social Network Content may no longer be available on and through the Services. You will have the ability to disable the connection between your account on the Services and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS. We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you of those contacts who have also registered to use the Services. You can deactivate the connection between the Services and your Third-Party Account by contacting us using the contact information below or through your account settings (if applicable). We will attempt to delete any information stored on our servers that was obtained through such Third-Party Account, except the username and profile picture that become associated with your account.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "12.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "SERVICES MANAGEMENT",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "13.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "PRIVACY POLICY",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We care about data privacy and security. Please review our Privacy Policy:",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://pulsehq.vercel.app/privacy-policy",
                target: "_blank",
                rel: "noopener noreferrer nofollow",
                class:
                  "novel-text-stone-400 novel-underline novel-underline-offset-[3px] hover:novel-text-stone-600 novel-transition-colors novel-cursor-pointer",
              },
            },
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 58, 250)",
              },
            },
          ],
          text: "https://pulsehq.vercel.app/privacy-policy",
        },
        {
          type: "text",
          text: ". By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "India",
        },
        {
          type: "text",
          text: ", then through your continued use of the Services, you are transferring your data to ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "India",
        },
        {
          type: "text",
          text: ", and you expressly consent to have your data transferred to and processed in ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "India",
        },
        {
          type: "text",
          text: ". Further, we do not knowingly accept, request, or solicit information from children or knowingly market to children. Therefore, in accordance with the U.S. Children’s Online Privacy Protection Act, if we receive actual knowledge that anyone under the age of 13 has provided personal information to us without the requisite and verifiable parental consent, we will delete that information from the Services as quickly as is reasonably practical.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "14.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "TERM AND TERMINATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "15.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "MODIFICATIONS AND INTERRUPTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "16.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "GOVERNING LAW",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "These Legal Terms shall be governed by and defined following the laws of India. Pulse and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "17.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "DISPUTE RESOLUTION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Informal Negotiations",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: 'To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least 30 days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Restrictions",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Exceptions to Informal Negotiations and Arbitration",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "18.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "CORRECTIONS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "19.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "DISCLAIMER",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "20.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "LIMITATIONS OF LIABILITY",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US OR . CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "21.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "INDEMNIFICATION",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "22.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "USER DATA",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "23.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "24.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "CALIFORNIA USERS AND RESIDENTS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "25.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "MISCELLANEOUS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
            {
              type: "textStyle",
              attrs: {
                color: "rgb(0, 0, 0)",
              },
            },
          ],
          text: "26.",
        },
        {
          type: "text",
          text: " ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "CONTACT US",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "rgb(89, 89, 89)",
              },
            },
          ],
          text: "In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at: sonu.sharma045@gmail.com",
        },
      ],
    },
  ],
};
