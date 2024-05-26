import { Badge, Button2, LoadingSpinner, Modal } from "@/components/ui/";
import { getStripe } from "@/lib/stripe/client";

import { IconMenu } from "@/components/atom/icon-menu";
import { Logo } from "@/components/atom/logo";
import { APP_DOMAIN } from "@/lib/constants/constants";
import { STAGGER_CHILD_VARIANTS } from "@/lib/constants/framer-motion";
import { SELF_SERVE_PAID_PLANS } from "@/lib/constants/pricing";
import { capitalize } from "@/lib/functions/capitalize";
import { useRouterStuff } from "@/lib/hooks";
import useTeam from "@/lib/swr/use-team";
import { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Confetti from "react-dom-confetti";
import CheckCircleFill from "../icons/check-circle-fill";
import { Popover2 } from "../popover-2";

const PERIODS = ["monthly", "yearly"] as const;

function UpgradePlanModal({
  showUpgradePlanModal,
  setShowUpgradePlanModal,
}: {
  showUpgradePlanModal: boolean;
  setShowUpgradePlanModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const params = useParams() as { team_slug: string };
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const welcomeFlow = pathname === "/welcome";
  const slug = welcomeFlow ? searchParams?.get("team_slug") : params.team_slug;

  const { activeTeam } = useTeam();
  const { plan: currentPlan } = activeTeam!;
  const plan = (searchParams.get("upgrade") ?? "pro") as Plan;
  const selectedPlan =
    SELF_SERVE_PAID_PLANS.find((p) => p!.name.toLowerCase() === plan)! ??
    SELF_SERVE_PAID_PLANS[0]!;
  const [openPlanSelector, setOpenPlanSelector] = useState(false);

  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("yearly");
  const [openPeriodSelector, setOpenPeriodSelector] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [clickedCompare, setClickedCompare] = useState(false);
  const { queryParams } = useRouterStuff();

  return (
    <Modal
      showModal={showUpgradePlanModal}
      setShowModal={setShowUpgradePlanModal}
      className="max-w-lg"
      preventDefaultClose={welcomeFlow}
      onClose={() => {
        if (welcomeFlow) {
          router.back();
        } else {
          queryParams({
            del: "upgrade",
          });
        }
      }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-8 sm:px-16"
      >
        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <Logo />
        </motion.div>
        <motion.h3
          className="text-lg font-medium"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Upgrade to {selectedPlan.name}
        </motion.h3>
        <motion.p
          className="text-center text-sm text-secondary-foreground/65"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Enjoy higher limits and extra features <br /> with Orgnise{" "}
          {selectedPlan.name}
        </motion.p>
      </motion.div>

      <div className="bg-accent/20 px-4 py-6 text-left sm:px-16">
        <div className="flex w-full">
          <Popover2
            content={
              <div className="w-full p-2 md:w-56">
                {SELF_SERVE_PAID_PLANS.map(({ name, colors }: any, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      queryParams({
                        set: {
                          upgrade: name.toLowerCase(),
                        },
                      });
                      setOpenPlanSelector(false);
                    }}
                    className="flex w-full items-center justify-between space-x-2 rounded-md p-2 hover:bg-popover-foreground/5 active:bg-accent/10 "
                  >
                    <IconMenu
                      text={name}
                      icon={
                        <div
                          className={cn("h-2 w-2 rounded-full", colors.bg)}
                        />
                      }
                    />
                    {plan === name.toLowerCase() && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            }
            openPopover={openPlanSelector}
            setOpenPopover={setOpenPlanSelector}
          >
            <button
              onClick={() => setOpenPlanSelector(!openPlanSelector)}
              className="mr-2 flex w-56 items-center justify-between space-x-2 rounded-md border-border bg-primary-foreground px-3 py-2.5 shadow transition-all duration-75 hover:shadow-md active:scale-[98%] dark:border"
            >
              <IconMenu
                text={selectedPlan.name}
                icon={
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      selectedPlan.colors.bg,
                    )}
                  />
                }
              />
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground/75 ${
                  openPlanSelector ? "rotate-180 transform" : ""
                } transition-all duration-75`}
              />
            </button>
          </Popover2>
          <Confetti
            active={period === "yearly"}
            config={{ elementCount: 200, spread: 90 }}
          />
          <Popover2
            content={
              <div className="w-full p-2 md:w-36">
                {PERIODS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPeriod(p);
                      setOpenPeriodSelector(false);
                    }}
                    className="flex w-full items-center justify-between space-x-2 rounded-md p-2 hover:bg-popover-foreground/5 active:bg-accent/10"
                  >
                    <span className="text-sm text-secondary-foreground/60">
                      {capitalize(p)}
                    </span>
                    {period === p && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            }
            openPopover={openPeriodSelector}
            setOpenPopover={setOpenPeriodSelector}
          >
            <button
              onClick={() => setOpenPeriodSelector(!openPeriodSelector)}
              className="flex flex-1 items-center justify-between space-x-2 rounded-md border-border bg-primary-foreground px-3 py-2.5 shadow transition-all duration-75 hover:shadow-md active:scale-[98%] dark:border"
            >
              <span className="text-sm text-secondary-foreground/60">
                {capitalize(period)}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground/75 ${
                  openPeriodSelector ? "rotate-180 transform" : ""
                } transition-all duration-75`}
              />
            </button>
          </Popover2>
        </div>
        <motion.div
          className="mb-4 mt-6 flex flex-col"
          variants={STAGGER_CHILD_VARIANTS}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-secondary-foreground/90">
                {selectedPlan.name} {capitalize(period)}
              </h4>
              <Badge
                variant="outline"
                className="text-sm font-normal normal-case text-secondary-foreground/60"
              >
                ${selectedPlan.price[period]?.toString()}
                /mo
                <span className="hidden sm:inline-block">
                  , billed {period}
                </span>
              </Badge>
            </div>
          </div>
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="my-4 flex flex-col space-y-2"
          >
            {selectedPlan.features.map(({ text }, i) => (
              <motion.div
                key={i}
                variants={STAGGER_CHILD_VARIANTS}
                className="flex items-center space-x-2 text-sm text-secondary-foreground/60"
              >
                <CheckCircleFill className="h-5 w-5 text-green-500" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
          <Button2
            text={`Upgrade to ${selectedPlan.name} ${capitalize(period)}`}
            loading={clicked}
            onClick={() => {
              setClicked(true);
              fetch(`/api/teams/${slug}/billing/upgrade`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  plan,
                  period,
                  baseUrl: `${APP_DOMAIN}${pathname}`,
                }),
              })
                .then(async (res) => {
                  if (res.status === 200) {
                    if (currentPlan === "free") {
                      const data = await res.json();
                      const { id: sessionId } = data;
                      const stripe = await getStripe();
                      stripe?.redirectToCheckout({ sessionId });
                    } else {
                      const url = await res.json();
                      router.push(url);
                    }
                  } else {
                    console.error(res);
                    setClicked(false);
                  }
                })
                .catch((err) => {
                  alert(err);
                  setClicked(false);
                });
            }}
          />

          <div className="mt-2 flex items-center justify-center space-x-2">
            {currentPlan === "free" ? (
              <a
                href="https://orgnise.in/pricing"
                target="_blank"
                className="text-center text-xs text-secondary-foreground/60 underline-offset-4 transition-all hover:text-secondary-foreground/80 hover:underline"
              >
                Compare plans
              </a>
            ) : (
              <button
                onClick={() => {
                  setClickedCompare(true);
                  fetch(`/api/teams/${slug}/billing/upgrade`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      plan,
                      period,
                      baseUrl: `${APP_DOMAIN}${pathname}`,
                      comparePlans: true,
                    }),
                  })
                    .then(async (res) => {
                      const url = await res.json();
                      if (res.status === 200) {
                        router.push(url);
                      } else {
                        console.error(url);
                        setClicked(false);
                      }
                    })
                    .catch((err) => {
                      alert(err);
                      setClicked(false);
                    });
                }}
                disabled={clickedCompare}
                className={cn(
                  "flex items-center space-x-2 text-center text-xs text-secondary-foreground/60",
                  clickedCompare
                    ? "cursor-not-allowed"
                    : "underline-offset-4 transition-all hover:text-secondary-foreground/80 hover:underline",
                )}
              >
                {clickedCompare && (
                  <LoadingSpinner className="h-4 w-4" aria-hidden="true" />
                )}
                <p>Compare plans</p>
              </button>
            )}
            <p className="text-secondary-foreground/60">•</p>
            {welcomeFlow ? (
              <Link
                href={`/${slug}`}
                className="text-center text-xs text-secondary-foreground/60 underline-offset-4 transition-all hover:text-secondary-foreground/80 hover:underline"
              >
                Skip for now
              </Link>
            ) : (
              <a
                href="https://orgnise.in/enterprise"
                target="_blank"
                className="text-center text-xs text-secondary-foreground/60 underline-offset-4 transition-all hover:text-secondary-foreground/80 hover:underline"
              >
                Looking for enterprise?
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </Modal>
  );
}

export function useUpgradePlanModal() {
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams?.get("upgrade")) {
      setShowUpgradePlanModal(true);
    } else {
      setShowUpgradePlanModal(false);
    }
  }, [searchParams]);

  const UpgradePlanModalCallback = useCallback(() => {
    return (
      <UpgradePlanModal
        showUpgradePlanModal={showUpgradePlanModal}
        setShowUpgradePlanModal={setShowUpgradePlanModal}
      />
    );
  }, [showUpgradePlanModal, setShowUpgradePlanModal]);

  return useMemo(
    () => ({
      setShowUpgradePlanModal,
      UpgradePlanModal: UpgradePlanModalCallback,
    }),
    [setShowUpgradePlanModal, UpgradePlanModalCallback],
  );
}
