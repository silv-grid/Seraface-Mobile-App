import Colors from "./colors";

export const Gradients = {
  // Button gradients (purple to pink variations)
  primaryButton: [Colors.primary600, Colors.accent500], // Purple to pink (main CTA buttons)
  secondaryButton: [Colors.primary500, Colors.primary700], // Purple variations

  // Background gradients
  lightBackground: [Colors.primary50, Colors.primary100], // Very light purple pattern
  cardBackground: [Colors.primary100, Colors.primary200], // Light purple card

  // Match percentage badge gradients
  matchHighBadge: [Colors.accent500, Colors.accent600], // Pink gradient (high match)
  matchMediumBadge: [Colors.primary500, Colors.primary600], // Purple gradient (medium match)

  // Tab navigation gradient
  tabGradient: [Colors.primary600, Colors.accent600], // Purple to pink

  // Header gradients
  headerGradient: [Colors.primary500, Colors.accent500], // Purple to pink

  // Progress bar gradients
  progressGradient: [Colors.accent400, Colors.accent600], // Pink gradient

  // Custom combinations
  purpleToPink: [
    // Colors.primary800,
    Colors.primary700,
    // Colors.primary600,
    // Colors.primary500,
    // Colors.primary400,
    Colors.accent300,
    // Colors.accent200,
  ], // Brand gradient
  purpleToPink3: [Colors.primary800, Colors.accent800],
  lightPurpleToPink: [
    Colors.primary500,
    Colors.primary400,
    Colors.accent200,
    Colors.accent50,
  ], // Brand gradient
  purple: [Colors.primary600, Colors.primary500, Colors.primary400],
  lightPurple: [Colors.primary400, Colors.primary300, Colors.primary200], // Subtle purple
  lightPink: [Colors.accent200, Colors.accent400], // Subtle pink
  logoGradient: [Colors.logoStart, Colors.logoEnd],
};

// Preset directions for common use cases
export const GradientDirections = {
  leftToRight: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  topToBottom: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  reverseDiagonal: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
};

// GradientView component example
// import { LinearGradient } from "expo-linear-gradient";

// export const GradientView = ({
//   preset = "primaryButton",
//   direction = "diagonal",
//   children,
//   style,
//   ...props
// }) => (
//   <LinearGradient
//     colors={Gradients[preset]}
//     start={
//       typeof direction === "string"
//         ? GradientDirections[direction].start
//         : direction.start
//     }
//     end={
//       typeof direction === "string"
//         ? GradientDirections[direction].end
//         : direction.end
//     }
//     style={style}
//     {...props}
//   >
//     {children}
//   </LinearGradient>
// );
