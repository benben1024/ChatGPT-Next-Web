import React, { useState } from "react";
import { useAccessStore, useAuthStore } from "../store";
import { Modal, List, ListItem, PasswordInput, showToast } from "./ui-lib";
import settingStyles from "./settings.module.scss";
import CancelIcon from "../icons/cancel.svg";
import SaveIcon from "../icons/save.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { IconButton } from "./button";

interface LoginModalProps {
  visible: boolean;
  onCancel: () => void;
  onLoginSuccess?: () => void; // 登录成功回调函数
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onCancel,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const accessStore = useAccessStore();
  const { username, password, setUsername, setPassword } = useAuthStore();
  const [form, setForm] = useState({ username, password });

  const handleOk = async () => {
    setLoading(true);
    try {
      const accessCode = `${form.username}+${form.password}`;

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          path: "v1/chat/completions",
          "access-code": accessCode,
        },
      });
      const response = await res.json();

      if (response.isAccessCodeAuthorized) {
        accessStore.updateCode(accessCode);
        setUsername(form.username);
        setPassword(form.password);
        onLoginSuccess && onLoginSuccess();
        onCancel();
      } else {
        showToast("用户名或密码错误");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    // 关闭前需手动更新form
    setForm({ username, password });
    onCancel();
  };

  if (!visible) return <div></div>;
  return (
    <div className="modal-mask">
      <Modal
        title="用户设置"
        onClose={closeModal}
        actions={[
          <IconButton
            key="cancel"
            icon={<CancelIcon />}
            text="取消"
            bordered
            onClick={closeModal}
          />,
          <IconButton
            key="sac=ve"
            icon={loading ? <LoadingIcon /> : <SaveIcon />}
            text="保存"
            bordered
            onClick={handleOk}
          />,
        ]}
      >
        <>
          <List>
            <ListItem>
              <div className={settingStyles["settings-title"]}>{"用户名"}</div>
              <input
                type="text"
                value={form.username}
                onInput={(e) => {
                  setForm({ ...form, username: e.currentTarget.value });
                }}
              ></input>
            </ListItem>
            <ListItem>
              <div className={settingStyles["settings-title"]}>{"密码"}</div>
              <PasswordInput
                value={form.password}
                type="text"
                placeholder="请输入密码"
                onChange={(e) => {
                  setForm({ ...form, password: e.currentTarget.value });
                }}
              />
            </ListItem>
          </List>
        </>
      </Modal>
    </div>
  );
};

export default LoginModal;
