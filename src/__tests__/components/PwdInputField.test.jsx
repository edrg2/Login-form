import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "./../../components/PwdInputField";
import PwdInputField from "./../../components/PwdInputField";

vi.mock("@fortawesome/react-fontawesome", async (importActual) => {
  const actual = await importActual();

  return {
    ...actual,
    FontAwesomeIcon: (props) => {
      return (
        <i data-testid={props["data-testid"]} data-icon-name={props.icon} />
      );
    },
  };
});

describe("PwdInputField 元件測試", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 渲染 ---
  it("應根據 props 正確渲染 input, label 和 icon", () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
      showPwdBtn: true,
      showForgotPwdLink: true,
    };

    render(<PwdInputField {...props} />);

    // *測試* input 應顯示在畫面上
    const inputElement = screen.getByLabelText("密碼");
    expect(inputElement).toBeInTheDocument();

    // *測試* input 屬性
    expect(inputElement).toHaveAttribute("name", "password");
    expect(inputElement).toHaveAttribute("placeholder", "密碼");
    expect(inputElement).toHaveAttribute("type", "password");

    // *測試* input-icon 應顯示在畫面上
    const inputIconElement = screen.getByTestId("icon-password");
    expect(inputIconElement).toBeInTheDocument();
    expect(inputIconElement).toHaveAttribute("data-icon-name", "lock");

    // *測試* button 應顯示在畫面上
    const buttonElement = screen.getByRole("button", { name: /顯示密碼/i });
    expect(buttonElement).toBeInTheDocument();

    // *測試* button-icon 應顯示在畫面上
    const buttonIconElement = screen.getByTestId("icon-lock");
    expect(buttonIconElement).toBeInTheDocument();
    expect(buttonIconElement).toHaveAttribute("data-icon-name", "eye");

    // *測試* link 的文字應顯示在畫面上
    const linkElement = screen.getByRole("link", { name: /忘記密碼?/i });
    expect(linkElement).toBeInTheDocument();
  });

  // --- 使用者互動 ---
  it("當使用者在 input 中輸入密碼時，應能正確更新其值", async () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    const user = userEvent.setup();

    // *測試* 初始值應為空
    const inputElement = screen.getByLabelText("密碼");
    expect(inputElement).toHaveValue("");

    // *測試* 驗證 input 的值是否已更新
    await user.type(inputElement, "testPassword");
    expect(inputElement).toHaveValue("testPassword");
  });

  it("當使用者點擊 label 時，input 應改成 focus 狀態", async () => {
    const props = {
      icon: "user",
      label: "使用者名稱",
      name: "username",
      register: mockRegister,
      errors: {},
    };
    const user = userEvent.setup();

    render(<PwdInputField {...props} />);

    const inputElement = screen.getByLabelText("使用者名稱");
    const labelElement = screen.getByText("使用者名稱").parentElement;

    // *測試* 確認 input 初始狀態不是 focus
    expect(inputElement).not.toHaveFocus();

    // *測試* 確認點擊 label 後，input 是否為 focus
    await user.click(labelElement);
    expect(inputElement).toHaveFocus();
  });

  it("當使用者按下顯示密碼的按鈕時，應能正確更新 input 的 type 值", async () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    const user = userEvent.setup();

    // *測試* input 的 type 值應為預設值 password
    const inputElement = screen.getByLabelText("密碼");
    expect(inputElement).toHaveAttribute("type", "password");

    // *測試* input 的 type 值應更改為 text
    const buttonElement = screen.getByRole("button", { name: /顯示密碼/i });
    await user.click(buttonElement);
    expect(inputElement).toHaveAttribute("type", "text");

    // *測試* input 的 type 值更改回 password
    await user.click(buttonElement);
    expect(inputElement).toHaveAttribute("type", "password");
  });

  // --- 錯誤顯示 ---
  it("當 props 中傳入錯誤訊息時，應顯示該錯誤", async () => {
    const errorMessage = "* 密碼長度不能少於 8 個字元";
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {
        password: {
          message: errorMessage,
        },
      },
    };

    render(<PwdInputField {...props} />);

    // *測試* 錯誤訊息應出現在頁面上
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("當 props 中沒有傳入錯誤訊息時，不應顯示錯誤", () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    // *測試* 錯誤訊息不應出現在頁面上
    const errorMessage = "* 密碼長度不能少於 8 個字元";
    const errorElement = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });

  // --- 整合測試 (React Hook Form) ---
  it("應使用傳入的 name 呼叫 register 函式", () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    // *測試* register 函數是否被以正確的 name 調用
    expect(mockRegister).toHaveBeenCalledWith("password");
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});
