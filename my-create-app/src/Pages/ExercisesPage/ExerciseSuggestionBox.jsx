// src/Pages/ExercisesPage/ExerciseSuggestionBox.jsx

import React, { useState } from "react";
import { Input, Button, message } from "antd";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../../firebase";

const db = getFirestore(app);

const ExerciseSuggestionBox = () => {
  const [exerciseSuggestion, setExerciseSuggestion] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendExerciseSuggestion = async () => {
    if (!exerciseSuggestion.trim()) {
      message.warning("⚠️ Vui lòng nhập góp ý trước khi gửi");
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "exerciseSuggestions"), {
        suggestion: exerciseSuggestion.trim(),
        createdAt: serverTimestamp(),
      });
      setExerciseSuggestion("");
      message.success("✅ Cảm ơn bạn đã góp ý bài tập!");
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi gửi góp ý, vui lòng thử lại");
    }
    setSending(false);
  };

  return (
    <div
      style={{
        marginTop: 16,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <Input.TextArea
        placeholder="Bạn muốn mình thêm bài tập nào thì góp ý nha..."
        value={exerciseSuggestion}
        onChange={(e) => setExerciseSuggestion(e.target.value)}
        rows={2}
        style={{ flex: 1, minWidth: 200, resize: "none" }}
        disabled={sending}
      />
      <Button
        type="primary"
        onClick={handleSendExerciseSuggestion}
        loading={sending}
      >
        Gửi góp ý bài tập
      </Button>
    </div>
  );
};

export default ExerciseSuggestionBox;
