import { useMemo, useState, useRef, type FormEvent, type MouseEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EVENT_CONFIG, type EventConfigType } from '../data/eventData';
import {
  generatePassDetails,
  generateQrMatrix,
  validateRsvpForm,
  type DiningPreference,
  type IssuedPass,
  type ParticipationTrack,
  type RsvpFormInput,
  type RsvpValidationErrors,
  type StudentBranch,
  type StudentSection,
} from '../utils/partyLogic';
import { downloadPassAsPng } from '../utils/passExport';
import { triggerCelebrationConfetti } from '../utils/confetti';

interface RsvpPassSectionProps {
  issuedPass: IssuedPass | null;
  onIssuePass: (pass: IssuedPass) => void;
  onResetPass: () => void;
  config?: EventConfigType;
}

const BRANCHES: { id: StudentBranch; label: string }[] = [
  { id: 'AIML', label: 'AIML' },
  { id: 'AIDS', label: 'AIDS' },
];

const SECTIONS: StudentSection[] = [
  'Section A',
  'Section B',
  'Section C',
  'Lateral Entry',
];

const DINING_OPTIONS: DiningPreference[] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Jain / Vegan',
];

const TRACK_OPTIONS: ParticipationTrack[] = [
  'General Entry',
  'Event Contestant (13 Activities)',
  'Stage Performer',
];

export function RsvpPassSection({
  issuedPass,
  onIssuePass,
  onResetPass,
  config = EVENT_CONFIG,
}: RsvpPassSectionProps) {
  const cfg = config ?? EVENT_CONFIG;
  const [formState, setFormState] = useState<RsvpFormInput>(() => ({
    fullName: issuedPass?.fullName ?? '',
    rollNumber: issuedPass?.rollNumber ?? '',
    email: issuedPass?.email ?? '',
    branch: issuedPass?.branch ?? 'AIML',
    section: issuedPass?.section ?? 'Section A',
    dining: issuedPass?.dining ?? 'Vegetarian',
    track: issuedPass?.track ?? 'General Entry',
  }));
  const [errors, setErrors] = useState<RsvpValidationErrors>({});
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  // 3D tilt tracking for digital pass (guarded for non-touch desktop)
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Only apply 3D tilt on devices that support hover (non-touch)
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const previewPass: IssuedPass = useMemo(() => {
    if (issuedPass) return issuedPass;
    const selectedBranch: StudentBranch = formState.branch === 'AIDS' ? 'AIDS' : 'AIML';
    const previewInput: RsvpFormInput = {
      fullName: formState.fullName.trim() || 'Your Name Here',
      rollNumber:
        formState.rollNumber.trim().toUpperCase() ||
        (selectedBranch === 'AIDS' ? '26AIDS000' : '26AIML000'),
      email:
        formState.email.trim() ||
        (selectedBranch === 'AIDS' ? 'fresher@aids.edu' : 'fresher@aiml.edu'),
      branch: selectedBranch,
      section: formState.section,
      dining: formState.dining,
      track: formState.track,
    };
    return generatePassDetails(previewInput, '2026-12-12T18:00:00.000Z');
  }, [issuedPass, formState]);

  const qrMatrix = useMemo(
    () => generateQrMatrix(previewPass.passCode, 17),
    [previewPass.passCode]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDownloadStatus(null);
    const nextErrors = validateRsvpForm(formState);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const pass = generatePassDetails(formState);
    onIssuePass(pass);

    // Trigger celebratory confetti burst!
    triggerCelebrationConfetti();
  };

  const handleDownload = () => {
    if (!issuedPass) return;
    const ok = downloadPassAsPng(issuedPass, cfg);
    if (ok) {
      setDownloadStatus('Pass PNG downloaded to your device.');
    }
  };

  const handleReset = () => {
    onResetPass();
    setDownloadStatus(null);
    setErrors({});
  };

  return (
    <section
      id="rsvp"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] bg-[#0C0C10] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-amber-500/5 rounded-full blur-[100px] sm:blur-[130px]"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8 sm:mb-10"
        >
          <p className="text-sm text-[#F5A623] font-medium mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Entry Registration</span>
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2 sm:mb-3">
            Claim your {cfg.brandName}{' '}
            <span className="text-gold-shimmer">digital pass.</span>
          </h2>
          <p className="text-xs sm:text-base text-zinc-400 leading-relaxed">
            Entry is complimentary for all 1st-year AIML &amp; AIDS students ({cfg.batchLabel}) at {cfg.collegeName}. Complete
            your details to receive your Auditorium gate assignment, lunch counter code,
            and downloadable QR pass.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Registration Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-6 rounded-2xl border border-white/[0.12] bg-[#121216] p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, fullName: e.target.value }))
                  }
                  placeholder="e.g. Ananya Sharma"
                  aria-invalid={Boolean(errors.fullName)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="rsvp-roll"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Roll Number / Student ID
                </label>
                <input
                  id="rsvp-roll"
                  type="text"
                  value={formState.rollNumber}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, rollNumber: e.target.value }))
                  }
                  placeholder="e.g. 26AIML042 / 26AIDS042"
                  aria-invalid={Boolean(errors.rollNumber)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                />
                {errors.rollNumber && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.rollNumber}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="rsvp-email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                College Email Address
              </label>
              <input
                id="rsvp-email"
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="e.g. ananya.sharma@kishkinda.edu"
                aria-invalid={Boolean(errors.email)}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <span className="block text-xs font-medium text-zinc-300 mb-1.5">
                Department (1st Year)
              </span>
              <div
                role="group"
                aria-label="Select Department"
                className="grid grid-cols-2 gap-2"
              >
                {BRANCHES.map((branchOption) => {
                  const isSelected = (formState.branch ?? 'AIML') === branchOption.id;
                  return (
                    <button
                      key={branchOption.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setFormState((s) => ({ ...s, branch: branchOption.id }))
                      }
                      className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F5A623]/15 border-[#F5A623]/50 text-[#F5A623]'
                          : 'bg-[#09090B] border-white/15 text-zinc-400 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {branchOption.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="rsvp-section"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Batch Section
                </label>
                <select
                  id="rsvp-section"
                  value={formState.section}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      section: e.target.value as StudentSection,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white focus:border-[#F5A623] transition-colors"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rsvp-dining"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Dining Preference
                </label>
                <select
                  id="rsvp-dining"
                  value={formState.dining}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      dining: e.target.value as DiningPreference,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white focus:border-[#F5A623] transition-colors"
                >
                  {DINING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="rsvp-track"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Participation Track
              </label>
              <select
                id="rsvp-track"
                value={formState.track}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    track: e.target.value as ParticipationTrack,
                  }))
                }
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white focus:border-[#F5A623] transition-colors"
              >
                {TRACK_OPTIONS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 text-sm font-semibold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2 text-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>{issuedPass ? 'Update Entry Pass' : 'Generate Entry Pass'}</span>
              </motion.button>

              {issuedPass && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white border border-white/15 hover:border-white/30 rounded-xl transition-colors whitespace-nowrap shrink-0 text-center"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Clear Pass</span>
                </motion.button>
              )}
            </div>
          </motion.form>

          {/* Live / Issued Digital Entry Pass Card with 3D Holographic Tilt Effect */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 space-y-4 w-full"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              data-testid="digital-entry-pass"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="group relative rounded-2xl border border-white/[0.14] hover:border-amber-500/50 bg-[#121216] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all"
            >
              {/* Dynamic Holographic Specular Glare */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.35), rgba(245,166,35,0.15) 40%, transparent 80%)`,
                }}
              />

              {/* Top luxury amber hairline bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#F5A623] via-[#FFC04D] to-amber-200" />

              <div className="p-5 sm:p-8 relative">
                {/* Pass Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <img
                      src="/kishkinda-logo.png"
                      alt="Kishkinda University Logo"
                      className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,166,35,0.4)] shrink-0"
                    />
                    <div>
                      <div className="text-[11px] sm:text-xs text-[#F5A623] font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{cfg.collegeName} · {cfg.department}</span>
                      </div>
                      <h3 className="font-display text-lg sm:text-2xl font-semibold text-white mt-0.5">
                        {cfg.brandName} Pass · {cfg.batchLabel}
                      </h3>
                    </div>
                  </div>

                  <div className="text-xs font-medium flex items-center gap-1.5">
                    {issuedPass ? (
                      <span className="text-emerald-400 inline-flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.15)] text-[11px] sm:text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Pass Issued
                      </span>
                    ) : (
                      <span className="text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-[11px] sm:text-xs">
                        Live Preview
                      </span>
                    )}
                  </div>
                </div>

                {/* Pass Body: Details + Perforation Cutouts + SVG QR */}
                <div className="relative py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center">
                  <div className="sm:col-span-7 md:col-span-8 space-y-4">
                    <div>
                      <div className="text-xs text-zinc-400">Attendee</div>
                      <div className="font-display text-xl sm:text-2xl font-semibold text-white mt-0.5 break-words group-hover:text-amber-200 transition-colors">
                        {previewPass.fullName}
                      </div>
                      <div className="text-xs font-mono tabular-nums text-zinc-300 mt-1">
                        {previewPass.rollNumber} · {previewPass.branch} · {previewPass.section}
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-white/[0.08]">
                      <div>
                        <dt className="text-[11px] sm:text-xs text-zinc-400">Check-In Gate</dt>
                        <dd className="text-xs sm:text-sm font-medium text-white mt-0.5 truncate">
                          {previewPass.gate}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] sm:text-xs text-zinc-400">Dining Lane</dt>
                        <dd className="text-xs sm:text-sm font-mono font-medium text-amber-300 mt-0.5 truncate">
                          {previewPass.diningCode} ({previewPass.dining})
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[11px] sm:text-xs text-zinc-400">Event Track</dt>
                        <dd className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5">
                          {previewPass.track}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Deterministic QR Block with Scanner Beam */}
                  <div className="sm:col-span-5 md:col-span-4 relative flex flex-col items-center justify-center border-t border-dashed border-white/20 sm:border-t-0 sm:border-l pt-5 sm:pt-0 sm:pl-6">
                    <div className="relative p-2.5 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                      {/* Animated Laser Sweep Beam */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent shadow-[0_0_8px_#F5A623] animate-laser pointer-events-none z-10" />

                      <svg
                        viewBox="0 0 17 17"
                        width="104"
                        height="104"
                        role="img"
                        aria-label={`QR verification code for pass ${previewPass.passCode}`}
                        className="block"
                      >
                        <rect width="17" height="17" fill="#FFFFFF" />
                        {qrMatrix.map((row, r) =>
                          row.map((filled, c) =>
                            filled ? (
                              <rect
                                key={`${r}-${c}`}
                                x={c}
                                y={r}
                                width={1}
                                height={1}
                                fill="#09090B"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>

                    <div className="mt-2.5 sm:mt-3 text-center">
                      <div className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-center gap-1">
                        <QrCode className="w-3 h-3 text-[#F5A623]" />
                        <span>Pass Code</span>
                      </div>
                      <div className="font-mono tabular-nums text-sm font-bold text-[#F5A623]">
                        {previewPass.passCode}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pass Footer */}
                <div className="pt-3.5 sm:pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-zinc-400">
                  <span className="font-mono tabular-nums">
                    {cfg.dateDisplay} · {cfg.timeDisplay.split(' ')[0] ?? '09:30 AM'}
                  </span>
                  <span>Present with College ID</span>
                </div>
              </div>
            </div>

            {/* Download action when issued */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
              {issuedPass ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 text-sm font-semibold text-white bg-[#1D1D24] hover:bg-[#262630] border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-center"
                >
                  <Download className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
                  <span>Download Pass (PNG)</span>
                </motion.button>
              ) : (
                <p className="text-xs text-zinc-400 text-center sm:text-left">
                  Submit registration to lock in your pass code and download as PNG.
                </p>
              )}

              <AnimatePresence>
                {downloadStatus && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    role="status"
                    className="text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{downloadStatus}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
