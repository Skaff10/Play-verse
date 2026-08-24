import { CornerBrackets, CornerBracketsBottom } from './CornerBracket';

/**
 * AUI-style "How It Works" section.
 * Light bg card with corner brackets, eyebrow + large heading,
 * and a step-by-step feature breakdown.
 */

const STEPS = [
  {
    number: '01',
    xp: '+2 XP',
    title: 'Add to your list',
    description:
      'Found something you want to watch or play? Add it to your backlog — your future self will thank you.',
  },
  {
    number: '02',
    xp: '+2 XP',
    title: 'Start watching or playing',
    description:
      'Mark it as in-progress. We\'ll keep track so you don\'t lose your place across fifty different titles.',
  },
  {
    number: '03',
    xp: '+5 XP',
    title: 'Finish and complete',
    description:
      'Actually finish something for once. You get the most XP for completed titles — no half-measures.',
  },
  {
    number: '04',
    xp: '+2 XP',
    title: 'Rate and review',
    description:
      'Score it 1–10 and write what you actually thought. Your ratings feed into Bayesian-weighted leaderboards.',
  },
];

export default function HowItWorksSection() {
  return (
    <div className="px-5 md:px-10">
      <div className="mx-auto flex w-full flex-col items-center overflow-hidden rounded-xl bg-mist p-6 text-space md:p-12 lg:p-16">
        <CornerBrackets variant="light" />

        <div className="mx-auto my-6 w-full max-w-[1193px] md:my-10">
          {/* Header */}
          <div className="mx-auto flex w-full max-w-[1193px] flex-col justify-between gap-6 lg:flex-row">
            <div className="max-w-[425px] flex-1">
              <div className="text-aui-eyebrow mb-0 inline-flex">
                How it works
              </div>
            </div>
            <div className="max-w-[729px] flex-1">
              <h2 className="text-aui-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Track everything{' '}
                <span className="opacity-50">you experience</span>
              </h2>
            </div>
          </div>

          {/* Steps grid */}
          <div className="mx-auto mt-12 grid w-full max-w-[1193px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="group relative flex flex-col gap-4 border-l-2 border-space/10 pl-6 transition-colors hover:border-fire"
              >
                {/* Step number */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold tracking-tight text-space/20">
                    {step.number}
                  </span>
                  <span className="rounded border border-fire/20 bg-fire/10 px-2 py-1 text-[11px] font-bold text-fire">
                    {step.xp}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold leading-tight text-space">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-space/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <CornerBracketsBottom variant="light" />
      </div>
    </div>
  );
}
