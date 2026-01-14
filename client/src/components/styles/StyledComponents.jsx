/**
 * StyledComponents.jsx
 *
 * Centralized collection of reusable styled UI components.
 *
 * Purpose:
 *  - Provide consistent styling across the application
 *  - Reduce inline style duplication
 *  - Encapsulate common UI patterns (inputs, buttons, links, loaders)
 *
 * This file contains only presentation-level components
 * and does not include any business logic.
 */

import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/color";

/**
 * VisuallyHiddenInput
 *
 * Utility input component that remains accessible to screen readers
 * while being visually hidden.
 *
 * Common use cases:
 *  - Custom file upload buttons
 *  - Accessibility-friendly hidden inputs
 */
const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

/**
 * Link
 *
 * Styled version of react-router-dom's Link component.
 * Used throughout the app for clickable navigation rows
 * such as chat items and sidebar entries.
 */
const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

/**
 * InputBox
 *
 * Styled input used mainly in chat message input areas.
 * Designed to blend into rounded containers.
 */
const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

/**
 * SearchField
 *
 * Styled input field used in search-related components.
 * Slightly larger padding and font size for better usability.
 */
const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  font-size: 1.1rem;
`;

/**
 * CurveButton
 *
 * Reusable rounded button component.
 * Typically used for primary actions such as submit or confirm.
 */
const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: ${matBlack};
  color: white;
  font-size: 1.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

/**
 * bounceAnimation
 *
 * Keyframe animation used to create a subtle bouncing effect.
 * Applied to loading skeletons for visual feedback.
 */
const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

/**
 * BouncingSkeleton
 *
 * Animated skeleton component used for typing indicators
 * and lightweight loading states.
 */
const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

export {
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
  BouncingSkeleton,
};
