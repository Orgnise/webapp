import * as React from "react";

interface Prop {}

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement>, Prop {}
const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
  ({ className, ...props }, ref) => {
    return (
      <h1
        {...props}
        ref={ref}
        className={`scroll-m-20 text-2xl font-normal tracking-tight lg:text-3xl ${className}`}
      />
    );
  },
);
H1.displayName = "H1";

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement>, Prop {}
const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        {...props}
        ref={ref}
        className={`scroll-m-20 text-xl font-normal tracking-tight lg:text-2xl ${className}`}
      />
    );
  },
);
H2.displayName = "H2";

interface H3Props extends React.HTMLAttributes<HTMLHeadingElement>, Prop {}
const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        {...props}
        ref={ref}
        className={`scroll-m-20 text-lg font-normal tracking-tight ${className}`}
      />
    );
  },
);
H3.displayName = "H3";

interface H4Props extends React.HTMLAttributes<HTMLHeadingElement>, Prop {}
const H4 = React.forwardRef<HTMLHeadingElement, H4Props>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        {...props}
        ref={ref}
        className={`scroll-m-20 text-base font-normal tracking-tight ${className}`}
      />
    );
  },
);
H4.displayName = "H4";

interface H5Props extends React.HTMLAttributes<HTMLHeadingElement>, Prop {}
const H5 = React.forwardRef<HTMLHeadingElement, H5Props>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        {...props}
        ref={ref}
        className={`scroll-m-20 text-sm font-normal tracking-tight ${className}`}
      />
    );
  },
);
H5.displayName = "H5";

interface PProps extends React.HTMLAttributes<HTMLParagraphElement>, Prop {}
const P = React.forwardRef<HTMLParagraphElement, PProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        {...props}
        ref={ref}
        className={`scroll-m-20 text-sm font-normal tracking-tight ${className}`}
      />
    );
  },
);
P.displayName = "P";

interface LargeProps extends React.HTMLAttributes<HTMLDivElement>, Prop {}
const LargeLabel = React.forwardRef<HTMLDivElement, LargeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={`text-lg font-normal ${className}`}
      />
    );
  },
);
LargeLabel.displayName = "LargeLabel";

interface SmallProps extends React.HTMLAttributes<HTMLElement>, Prop {}
const SmallLabel = React.forwardRef<HTMLElement, SmallProps>(
  ({ className, ...props }, ref) => {
    return (
      <small
        {...props}
        ref={ref}
        className={`text-sm font-medium leading-none ${className}`}
      />
    );
  },
);
SmallLabel.displayName = "SmallLabel";

interface MutedProps extends React.HTMLAttributes<HTMLParagraphElement>, Prop {}
const MutedLabel = React.forwardRef<HTMLParagraphElement, MutedProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        {...props}
        ref={ref}
        className={`text-sm text-muted-foreground ${className}`}
      />
    );
  },
);
MutedLabel.displayName = "MutedLabel";

export { H1, H2, H3, H4, H5, LargeLabel, MutedLabel, P, SmallLabel };
