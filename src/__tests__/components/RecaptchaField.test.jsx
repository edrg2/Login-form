import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import RecaptchaField from "../../components/RecaptchaField";

vi.mock("react-google-recaptcha", async () => {
  // vi.mock 無法訪問位於頂層作用域導入的變數( hoisted )，因此 forward 要動態導入，否則 test 會報錯
  const { forwardRef } = await import("react");
  return {
    default: forwardRef((props, ref) => {
      return (
        <div
          data-testid="mock-recaptcha"
          ref={ref}
          onClick={() => props.onChange("mock-recaptcha-token")}
        >
          <p>sitekey: {props.sitekey}</p>
          <p>hl: {props.hl}</p>
        </div>
      );
    }),
  };
});

describe("RecaptchaField 元件測試", () => {
  // --- 渲染 ---
  it("應正確渲染 Mock 的 ReCAPTCHA 元件", () => {
    const {
      result: {
        current: { control },
      },
    } = renderHook(() => useForm());

    render(<RecaptchaField name="ReCAPTCHA" control={control} errors={{}} />);

    // *測試* Mock reCAPTCHA 是否在頁面上
    const recaptchaElement = screen.getByTestId("mock-recaptcha");
    expect(recaptchaElement).toBeInTheDocument();

    // *測試* 驗證 props 是否正確傳遞給 Mock reCAPTCHA
    expect(
      screen.getByText("sitekey: 6LdcQoUrAAAAAE5xIrwWCxdIbqI9v1Y7c4CUtGIe")
    ).toBeInTheDocument();
    expect(screen.getByText("hl: zh-TW")).toBeInTheDocument();
  });

  // --- 使用者互動 (整合 React Hook Form) ---
  it("當使用者點擊 Mock ReCAPTCHA 時，應觸發 onChange 並更新表單值", async () => {
    const {
      result: {
        current: { control, watch },
      },
    } = renderHook(() =>
      useForm({
        defaultValues: {
          ReCAPTCHA: "",
        },
      })
    );

    const user = userEvent.setup();

    render(<RecaptchaField name="ReCAPTCHA" control={control} errors={{}} />);

    // *測試* 初始值應為空
    expect(watch("ReCAPTCHA")).toBe("");

    const recaptchaElement = screen.getByTestId("mock-recaptcha");
    await user.click(recaptchaElement);
    expect(watch("ReCAPTCHA")).toBe("mock-recaptcha-token");
  });

  // --- 錯誤訊息顯示 ---
  it("當 props 中傳入錯誤訊息時，應顯示錯誤", () => {
    const {
      result: {
        current: { control },
      },
    } = renderHook(() => useForm());
    const errorMessage = "* 請勾選完成驗證";
    const props = {
      name: "ReCAPTCHA",
      control,
      errors: {
        ReCAPTCHA: {
          message: errorMessage,
        },
      },
    };

    render(<RecaptchaField {...props} />);

    // *測試* 錯誤訊息應出現在頁面上
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("當 props 中沒有傳入錯誤訊息時，不應顯示錯誤", () => {
    const {
      result: {
        current: { control },
      },
    } = renderHook(() => useForm());
    const props = {
      name: "ReCAPTCHA",
      control,
      errors: {},
    };

    render(<RecaptchaField {...props} />);

    // *測試* 錯誤訊息不應出現在頁面上
    const errorMessage = "* 請勾選完成驗證";
    const errorElement = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });
});
