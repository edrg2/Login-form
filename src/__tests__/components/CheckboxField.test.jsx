import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CheckboxField from "../../components/CheckboxField";

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

const mockRegister = vi.fn();
const toast = (await import("react-hot-toast")).default;

describe("CheckboxField 元件測試", () => {
  // --- 渲染 ---
  it("應根據 props 正確渲染 checkbox 和 label", () => {
    const props = {
      name: "terms",
      label: "請同意並勾選",
      register: mockRegister,
      errors: {},
    };

    render(<CheckboxField {...props} />);

    // *測試* 勾選框是否在頁面上
    const checkbox = screen.getByRole("checkbox", { name: /請同意並勾選/i });
    expect(checkbox).toBeInTheDocument();

    // *測試* 連結是否在頁面上
    const link = screen.getByRole("link", { name: /服務條款/i });
    expect(link).toBeInTheDocument();
  });

  // --- 使用者互動 ---
  it("當使用者點擊 checkbox 時，應切換其選中狀態", async () => {
    const props = {
      name: "terms",
      label: "請同意並勾選",
      register: mockRegister,
      errors: {},
    };
    const user = userEvent.setup();

    render(<CheckboxField {...props} />);

    // *測試* 勾選框默認應為 未選中 狀態
    const checkbox = screen.getByRole("checkbox", { name: /請同意並勾選/i });
    expect(checkbox).not.toBeChecked();

    // *測試* 勾選框應更改為 已選中 狀態
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // *測試* 勾選框應更改回 未選中 狀態
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("當使用者點擊 label 時，也應切換 checkbox 的選中狀態", async () => {
    const props = {
      name: "terms",
      label: "請同意並勾選",
      register: mockRegister,
      errors: {},
    };
    const user = userEvent.setup();

    render(<CheckboxField {...props} />);

    // *測試* 勾選框默認應為 未選中 狀態
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    // *測試* 勾選框應更改為 已選中 狀態
    const label = screen.getByText(/請同意並勾選/i);
    await user.click(label);
    expect(checkbox).toBeChecked();
  });

  it("當使用者點擊「忘記密碼」連結時，應呼叫 toast.error", async () => {
    const props = {
      name: "terms",
      label: "請同意並勾選",
      register: mockRegister,
      errors: {},
    };

    const user = userEvent.setup();

    render(<CheckboxField {...props} />);

    // *測試* toast.error 是否被呼叫
    const linkElement = screen.getByRole("link", { name: /服務條款/i });
    await user.click(linkElement);
    expect(toast.error).toHaveBeenCalledWith("此連結僅限展示，並無實際用途", {
      duration: 2000,
      icon: "👾",
      style: {
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#E8AB61",
      },
    });
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  // --- 錯誤訊息顯示 ---
  it("當 props 中傳入錯誤訊息時，應顯示該錯誤", () => {
    const errorMessage = "* 請詳閱並同意服務條款";
    const props = {
      name: "terms",
      label: "請同意並勾選",
      register: mockRegister,
      errors: {
        terms: {
          message: errorMessage,
        },
      },
    };

    render(<CheckboxField {...props} />);

    // *測試* 錯誤訊息應出現在頁面上
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("當 props 中沒有傳入錯誤訊息時，不應顯示錯誤元素", () => {
    const props = {
      name: "terms",
      label: "我同意",
      register: mockRegister,
      errors: {},
    };

    render(<CheckboxField {...props} />);

    // *測試* 錯誤訊息不應出現在頁面上
    const errorMessage = "* 請詳閱並同意服務條款";
    const errorElement = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });

  // 驗證與 React Hook Form 的整合
  it("應使用傳入的 name 呼叫 register 函式", () => {
    const props = {
      name: "myCustomCheckbox",
      label: "自訂選項",
      register: mockRegister,
      errors: {},
    };

    render(<CheckboxField {...props} />);

    // *測試* 確認 register 函式是否呼叫正確
    expect(mockRegister).toHaveBeenCalledWith("myCustomCheckbox");
  });
});
