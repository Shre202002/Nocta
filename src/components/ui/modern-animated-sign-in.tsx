'use client';

import {
  memo,
  type ReactNode,
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type MouseEvt = React.MouseEvent<HTMLDivElement>;

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {open ? (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.1 4.7A11.5 11.5 0 0 1 12 4c6.5 0 10 8 10 8a18.7 18.7 0 0 1-3.3 4.7" />
        <path d="M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5.4-1.4" />
      </>
    )}
  </svg>
);

const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) {
    const radius = 100;
    const [visible, setVisible] = useState(false);
    const [xy, setXY] = useState({ x: 0, y: 0 });

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvt) {
      const { left, top } = currentTarget.getBoundingClientRect();
      setXY({ x: clientX - left, y: clientY - top });
    }

    return (
      <div
        style={{
          background: `radial-gradient(${visible ? `${radius}px` : '0px'} circle at ${xy.x}px ${xy.y}px, #3b82f6, transparent 80%)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <input
          type={type}
          className={cn(
            'shadow-input flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-300 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:placeholder:text-neutral-600 dark:focus-visible:ring-neutral-600',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }),
);
Input.displayName = 'Input';

type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  className?: string;
};

const BoxReveal = memo(function BoxReveal({ children, width = 'fit-content', boxColor = '#5046e6', className }: BoxRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ width }} className={cn('relative overflow-hidden', className)}>
      <div className={cn('transition duration-700', visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0')}>{children}</div>
      {!visible && <div className="absolute inset-[4px] z-20 rounded" style={{ background: boxColor }} />}
    </section>
  );
});

type RippleProps = { mainCircleSize?: number; mainCircleOpacity?: number; numCircles?: number; className?: string };
const Ripple = memo(function Ripple({ mainCircleSize = 210, mainCircleOpacity = 0.24, numCircles = 11, className = '' }: RippleProps) {
  return (
    <section className={`max-w-[50%] absolute inset-0 flex items-center justify-center [mask-image:linear-gradient(to_bottom,black,transparent)] ${className}`}>
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        return (
          <span
            key={i}
            className="absolute animate-ripple rounded-full border bg-foreground/15"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: mainCircleOpacity - i * 0.03,
              animationDelay: `${i * 0.06}s`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

type OrbitingCirclesProps = { className?: string; children: ReactNode; reverse?: boolean; duration?: number; delay?: number; radius?: number; path?: boolean };
const OrbitingCircles = memo(function OrbitingCircles({ className, children, reverse = false, duration = 20, delay = 10, radius = 50, path = true }: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
          <circle className="stroke-black/10 stroke-1 dark:stroke-white/10" cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      <section
        style={{
          ['--duration' as string]: `${duration}`,
          ['--radius' as string]: `${radius}`,
          ['--delay' as string]: `${-delay}`,
        }}
        className={cn('absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10', reverse && '[animation-direction:reverse]', className)}
      >
        {children}
      </section>
    </>
  );
});

type IconConfig = { className?: string; duration?: number; delay?: number; radius?: number; path?: boolean; reverse?: boolean; component: () => ReactNode };

const TechOrbitDisplay = memo(function TechOrbitDisplay({ iconsArray, text = 'Animated Login' }: { iconsArray: IconConfig[]; text?: string }) {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">{text}</span>
      {iconsArray.map((icon, index) => (
        <OrbitingCircles key={index} className={icon.className} duration={icon.duration} delay={icon.delay} radius={icon.radius} path={icon.path} reverse={icon.reverse}>
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

type Field = { label: string; required?: boolean; type: 'text' | 'email' | 'password'; placeholder?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void };

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AnimatedForm = memo(function AnimatedForm({ header, subHeader, fields, submitButton, textVariantButton, errorField, onSubmit, googleLogin, goTo }: AnimatedFormProps) {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const el = (event.currentTarget.elements.namedItem(field.label) as HTMLInputElement | null);
      const value = el?.value ?? '';
      if (field.required && !value) currentErrors[field.label] = `${field.label} is required`;
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) currentErrors[field.label] = 'Invalid email address';
      if (field.type === 'password' && value && value.length < 6) currentErrors[field.label] = 'Password must be at least 6 characters long';
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    onSubmit(event);
  };

  return (
    <section className="mx-auto flex w-96 max-w-full flex-col gap-4">
      <BoxReveal boxColor="var(--skeleton)"><h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">{header}</h2></BoxReveal>
      {subHeader && <BoxReveal boxColor="var(--skeleton)" className="pb-2"><p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-300">{subHeader}</p></BoxReveal>}

      {googleLogin && (
        <>
          <BoxReveal boxColor="var(--skeleton)" width="100%">
            <button className="g-button group/btn h-10 w-full rounded-md border bg-transparent font-medium" type="button">
              <span className="flex h-full w-full items-center justify-center gap-3">
                <Image src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" width={20} height={20} alt="Google" />
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>
          <BoxReveal boxColor="var(--skeleton)" width="100%"><section className="flex items-center gap-4"><hr className="flex-1 border border-dashed border-neutral-300 dark:border-neutral-700" /><p className="text-sm text-neutral-700 dark:text-neutral-300">or</p><hr className="flex-1 border border-dashed border-neutral-300 dark:border-neutral-700" /></section></BoxReveal>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <section className="mb-4 grid grid-cols-1 gap-3">
          {fields.map((field) => (
            <section key={field.label} className="flex flex-col gap-2">
              <BoxReveal boxColor="var(--skeleton)"><Label htmlFor={field.label}>{field.label} <span className="text-red-500">*</span></Label></BoxReveal>
              <BoxReveal width="100%" boxColor="var(--skeleton)">
                <section className="relative">
                  <Input
                    type={field.type === 'password' ? (visible ? 'text' : 'password') : field.type}
                    id={field.label}
                    name={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                  />
                  {field.type === 'password' && (
                    <button type="button" onClick={() => setVisible((v) => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm">
                      <EyeIcon open={visible} />
                    </button>
                  )}
                </section>
                <section className="h-4">{errors[field.label] && <p className="text-xs text-red-500">{errors[field.label]}</p>}</section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal width="100%" boxColor="var(--skeleton)">{errorField && <p className="mb-4 text-sm text-red-500">{errorField}</p>}</BoxReveal>
        <BoxReveal width="100%" boxColor="var(--skeleton)">
          <button className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-zinc-200 to-zinc-200 font-medium text-black outline-hidden dark:from-zinc-900 dark:to-zinc-900 dark:text-white" type="submit">
            {submitButton} &rarr;
            <BottomGradient />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor="var(--skeleton)">
            <section className="mt-4 text-center"><button className="text-sm text-blue-500" onClick={goTo}>{textVariantButton}</button></section>
          </BoxReveal>
        )}
      </form>
    </section>
  );
});

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

interface AuthTabsProps {
  formFields: {
    header: string;
    subHeader?: string;
    fields: Field[];
    submitButton: string;
    textVariantButton?: string;
  };
  goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AuthTabs = memo(function AuthTabs({ formFields, goTo, handleSubmit }: AuthTabsProps) {
  return (
    <div className="flex w-full max-lg:justify-center md:w-auto">
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center px-[10%] lg:w-1/2">
        <AnimatedForm {...formFields} onSubmit={handleSubmit} goTo={goTo} googleLogin="Login with Google" />
      </div>
    </div>
  );
});

const Label = memo(function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />;
});

export { Input, BoxReveal, Ripple, OrbitingCircles, TechOrbitDisplay, AnimatedForm, AuthTabs, Label, BottomGradient };
