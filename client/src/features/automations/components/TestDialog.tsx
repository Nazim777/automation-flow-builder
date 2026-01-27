"use client";

import React, { useState } from "react";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { validateEmail } from "../utils/validation";
import toast from "react-hot-toast";

interface TestDialogProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export const TestDialog: React.FC<TestDialogProps> = ({
  isOpen,
  loading,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.error || "");
      toast.error(validation.error!);
      return;
    }

    onSubmit(email);
    setEmail("");
    setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Test Automation"
      footer={
        <>
          <Button
            variant="success"
            onClick={handleSubmit}
            loading={loading}
            className="flex-1"
          >
            Start Test
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </>
      }
    >
      <p className="text-gray-600 mb-4">
        Enter an email address to receive test messages:
      </p>
      <Input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        placeholder="your@email.com"
        error={error}
        disabled={loading}
      />
    </Modal>
  );
};
