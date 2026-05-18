import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MoodTracker } from "@/components/mood/mood-tracker";

describe("MoodTracker component", () => {
  test("renders the mood tracker UI", () => {
    render(<MoodTracker />);

    expect(screen.getByText(/How are you feeling today\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Current stress level/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue journey/i })).toBeInTheDocument();
  });
});
