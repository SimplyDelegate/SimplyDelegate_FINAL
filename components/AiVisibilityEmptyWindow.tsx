"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import { registerScrollTrigger, shouldReduceMotion } from "@/lib/animations";

const CHAT_PROMPT = "Welche Baufirma in Bremerhaven ist gut?";
const ANSWER_HEADING = "Empfehlung: IHRE FIRMA";
const ANSWER_TEXT =
  "Für Bauprojekte in Bremerhaven ist IHRE FIRMA eine relevante Option, weil der digitale Auftritt klar, vertrauenswürdig und regional ausgerichtet ist. Leistungen, Referenzen und Ansprechpartner sind verständlich dargestellt, sodass Kunden schnell erkennen, wofür das Unternehmen steht und warum es passend ist.";
const ANSWER_TAGS = [
  "Lokaler Bezug",
  "Klare Leistungen",
  "Referenzen",
  "Vertrauenssignale",
];
const ANSWER_NOTE =
  "Nutzer klicken auf KI-Empfehlungen, weil sie der Vorauswahl vertrauen und Zeit sparen wollen";
const ANSWER_SEGMENTS = ANSWER_TEXT.split(" ");

const REVEAL_COMPLETE_PROGRESS = 0.78;
const PIN_RELEASE_PROGRESS = 0.98;

export function AiVisibilityEmptyWindow() {
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const promptFieldRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLSpanElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const answerMaskRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const hasRevealCompletedRef = useRef(false);
  const [hasRevealCompleted, setHasRevealCompleted] = useState(false);

  useLayoutEffect(() => {
    const ScrollTrigger = registerScrollTrigger();
    const stage = stageRef.current;
    const shell = shellRef.current;
    const toolbar = toolbarRef.current;
    const body = bodyRef.current;
    const promptField = promptFieldRef.current;
    const promptText = promptTextRef.current;
    const userBubble = userBubbleRef.current;
    const answer = answerRef.current;
    const answerMask = answerMaskRef.current;
    const tags = tagsRef.current;
    const note = noteRef.current;
    const section = stage?.closest<HTMLElement>("#ki-sichtbarkeit");
    const pin = stage?.parentElement;

    if (
      !ScrollTrigger ||
      !stage ||
      !shell ||
      !toolbar ||
      !body ||
      !promptField ||
      !promptText ||
      !userBubble ||
      !answer ||
      !answerMask ||
      !tags ||
      !note ||
      !section ||
      !pin
    ) {
      return;
    }

    const answerHeading = answerMask.querySelector<HTMLElement>("h3");
    const answerSegments = Array.from(
      answerMask.querySelectorAll<HTMLElement>(".ai-chat-answer-segment"),
    );

    if (!answerHeading || !answerSegments.length) {
      return;
    }

    const persistentChromeDetails = Array.from(
      toolbar.querySelectorAll<HTMLElement>(".browser-dots, .mockup-note"),
    );

    const setFinalRevealState = () => {
      gsap.set(stage, { opacity: 1 });
      gsap.set(shell, { y: 0 });
      gsap.set([body, ...persistentChromeDetails], { opacity: 1, y: 0 });
      gsap.set(promptField, {
        opacity: 1,
        y: 0,
        borderColor: "rgba(255, 255, 255, 0.1)",
      });
      gsap.set(promptText, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(userBubble, { opacity: 1, y: 0, clipPath: "none" });
      gsap.set(answer, { opacity: 1, y: 0 });
      gsap.set(answerMask, { clipPath: "none" });
      gsap.set([answerHeading, ...answerSegments], { opacity: 1, y: 0 });
      gsap.set([tags, note], { opacity: 1, y: 0 });
    };

    const ctx = gsap.context(() => {
      if (shouldReduceMotion()) {
        gsap.set(
          [
            stage,
            shell,
            body,
            promptField,
            promptText,
            userBubble,
            answer,
            answerMask,
            answerHeading,
            ...answerSegments,
            tags,
            note,
            ...persistentChromeDetails,
          ],
          { opacity: 1, y: 0, clearProps: "transform" },
        );
        gsap.set(promptText, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([userBubble, answerMask], { clipPath: "none" });
        gsap.set([answerHeading, ...answerSegments], { opacity: 1, y: 0 });
        hasRevealCompletedRef.current = true;
        setHasRevealCompleted(true);
        return;
      }

      gsap.set(stage, { opacity: 0 });
      gsap.set(shell, { y: 54 });
      gsap.set(persistentChromeDetails, { opacity: 1, y: 0 });
      gsap.set(body, { opacity: 1, y: 0 });
      gsap.set(promptField, {
        opacity: 1,
        y: 0,
        borderColor: "rgba(255, 255, 255, 0.08)",
      });
      gsap.set(promptText, {
        opacity: 0.92,
        clipPath: "inset(0% 100% 0% 0%)",
      });
      gsap.set(userBubble, {
        opacity: 0,
        y: 12,
        clipPath: "none",
      });
      gsap.set(answer, { opacity: 0, y: 18 });
      gsap.set(answerMask, { clipPath: "none" });
      gsap.set(answerHeading, { opacity: 0 });
      gsap.set(answerSegments, { opacity: 0 });
      gsap.set([tags, note], { opacity: 0, y: 12 });

      let timeline: ReturnType<typeof gsap.timeline> | null = null;
      let answerTimeline: ReturnType<typeof gsap.timeline> | null = null;
      let answerStarted = false;
      let completedScrollTrigger:
        | InstanceType<typeof ScrollTrigger>
        | null = null;

      const completeReveal = (
        scrollTrigger?: InstanceType<typeof ScrollTrigger>,
      ) => {
        if (!hasRevealCompletedRef.current) {
          setHasRevealCompleted(true);
        }

        hasRevealCompletedRef.current = true;
        completedScrollTrigger = scrollTrigger ?? completedScrollTrigger;
        timeline?.progress(1).pause();
        answerTimeline?.progress(1).pause();
        setFinalRevealState();
      };

      const removeCompletedPin = () => {
        if (!completedScrollTrigger) return;

        const trigger = completedScrollTrigger;
        completedScrollTrigger = null;
        trigger.kill(true, true);
        setFinalRevealState();

        const keepAiSectionInView = () => {
          window.scrollTo({
            top: section.offsetTop,
            behavior: "auto",
          });
        };

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          keepAiSectionInView();
          ScrollTrigger.update();
        });
      };

      const showUserBubble = () => {
        gsap.set(userBubble, { opacity: 1, y: 0, clipPath: "none" });
      };

      const hideUserBubble = () => {
        gsap.set(userBubble, { opacity: 0, y: 12, clipPath: "none" });
      };

      answerTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      answerTimeline
        .to(answer, { opacity: 1, y: 0, duration: 0.18, ease: "power3.out" })
        .to(answerHeading, { opacity: 1, duration: 0.22 }, 0.05)
        .to(
          answerSegments,
          {
            opacity: 1,
            duration: 0.16,
            stagger: 0.035,
          },
          0.28,
        );

      timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.35}`,
          scrub: 0.9,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!hasRevealCompletedRef.current) {
              if (self.progress >= 0.5) {
                showUserBubble();
              } else {
                hideUserBubble();
              }

              if (self.progress >= 0.65) {
                if (!answerStarted) {
                  answerStarted = true;
                  answerTimeline?.play();
                }
              } else if (answerStarted) {
                answerStarted = false;
                answerTimeline?.pause(0);
              }
            }

            if (
              hasRevealCompletedRef.current ||
              self.progress >= REVEAL_COMPLETE_PROGRESS
            ) {
              completeReveal(self);

              if (self.progress >= PIN_RELEASE_PROGRESS) {
                removeCompletedPin();
              }

              return;
            }
          },
          onLeaveBack: (self) => {
            if (hasRevealCompletedRef.current) {
              completeReveal(self);
            }
          },
        },
      });

      timeline
        .to({}, { duration: 0.2 })
        .to(
          stage,
          {
            opacity: 1,
            duration: 0.15,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          shell,
          {
            y: 0,
            duration: 0.15,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          promptText,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.2,
            ease: "power1.inOut",
          },
          0.2,
        )
        .to(
          promptField,
          {
            borderColor: "rgba(255, 255, 255, 0.16)",
            duration: 0.08,
            ease: "power2.out",
          },
          0.4,
        )
        .to(
          promptField,
          {
            borderColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.08,
            ease: "power2.out",
          },
          0.48,
        )
        .to(
          userBubble,
          { duration: 0 },
          0.5,
        )
        .to(
          tags,
          {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out",
          },
          0.68,
        )
        .to(
          note,
          {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.72,
        )
        .to({}, { duration: 0.2 }, 0.78);
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`serp-demo-stage ai-empty-window-stage absolute left-4 right-4 top-[55vh] z-10 mx-auto w-auto max-w-[1120px] sm:left-8 sm:right-8 lg:left-auto lg:right-[7vw] lg:top-1/2 lg:mx-0 lg:w-[52vw] lg:max-w-[860px] lg:-translate-y-1/2 ${
        hasRevealCompleted ? "is-reveal-complete" : ""
      }`}
    >
      <div ref={shellRef} className="demo-shell ai-empty-window-shell">
        <div className="browser-chrome">
          <div ref={toolbarRef} className="browser-toolbar">
            <div className="browser-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="mockup-note">BEISPIELHAFTE DARSTELLUNG</span>
          </div>
        </div>
        <div ref={bodyRef} className="ai-empty-window-body">
          <div className="ai-chat-transcript" aria-live="polite">
            <div ref={userBubbleRef} className="ai-chat-user-bubble">
              {CHAT_PROMPT}
            </div>

            <div ref={answerRef} className="ai-chat-answer">
              <div ref={answerMaskRef} className="ai-chat-answer-mask">
                <h3>{ANSWER_HEADING}</h3>
                <p>
                  {ANSWER_SEGMENTS.map((segment, index) => {
                    const isCompanyLink =
                      segment === "IHRE" && ANSWER_SEGMENTS[index + 1] === "FIRMA";
                    const isCompanyLinkRemainder =
                      segment === "FIRMA" && ANSWER_SEGMENTS[index - 1] === "IHRE";

                    if (isCompanyLinkRemainder) {
                      return null;
                    }

                    return (
                      <span
                        key={`${segment}-${index}`}
                        className={`ai-chat-answer-segment ${
                          isCompanyLink ? "ai-chat-answer-link" : ""
                        }`}
                      >
                        {isCompanyLink
                          ? "IHRE FIRMA"
                          : index < ANSWER_SEGMENTS.length - 1
                            ? `${segment} `
                            : segment}
                      </span>
                    );
                  })}
                </p>
              </div>

              <div ref={tagsRef} className="ai-chat-tags">
                {ANSWER_TAGS.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p ref={noteRef} className="ai-chat-note ai-chat-result-note">
                {ANSWER_NOTE}
              </p>
            </div>
          </div>

          <div ref={promptFieldRef} className="ai-chat-prompt-field">
            <span
              className="ai-chat-prompt-icon ai-chat-prompt-icon--plus"
              role="img"
              aria-label="Weitere Optionen"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span ref={promptTextRef} className="ai-chat-prompt-text">
              {CHAT_PROMPT}
            </span>
            <span className="ai-chat-prompt-actions">
              <span
                className="ai-chat-prompt-icon ai-chat-prompt-icon--mic"
                role="img"
                aria-label="Audio aufnehmen"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4.2a2.75 2.75 0 0 0-2.75 2.75v4.7a2.75 2.75 0 0 0 5.5 0v-4.7A2.75 2.75 0 0 0 12 4.2Z" />
                  <path d="M6.75 11.35a5.25 5.25 0 0 0 10.5 0" />
                  <path d="M12 16.6v3.15" />
                  <path d="M9.1 19.75h5.8" />
                </svg>
              </span>
              <span
                className="ai-chat-prompt-voice"
                role="img"
                aria-label="Voice verwenden"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2.8" y="9" width="3" height="6" rx="1.5" />
                  <rect x="6.8" y="6.5" width="3" height="11" rx="1.5" />
                  <rect x="10.8" y="4.5" width="3" height="15" rx="1.5" />
                  <rect x="14.8" y="7" width="3" height="10" rx="1.5" />
                  <rect x="18.8" y="10" width="3" height="4" rx="1.5" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
