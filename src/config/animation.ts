export const ANIMATION_DURATION = 400;

export const ANIMATION_EASING = {
  default: [0.4, 0.0, 0.2, 1], // Standard easing
  in: [0.0, 0.0, 0.2, 1], // Deceleration
  out: [0.4, 0.0, 1, 1], // Acceleration
};

export const TRANSITION_DEFAULTS = {
  duration: ANIMATION_DURATION / 1000,
  ease: ANIMATION_EASING.default,
};
