import { CommentInterface, RatedByInterface } from "Models";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import Rating from "./Rating";

interface Props {
  comment: CommentInterface;
  deleteComment: (id: string) => void;
  handleEditChange: (val: string) => void;
  handleSetEditCommentId: (val: string) => void;
  handleEditSubmit: () => void;
  rating: RatedByInterface;
}

/* eslint-disable jsx-a11y/alt-text */
const Comment = ({
  comment,
  deleteComment,
  handleEditChange,
  handleSetEditCommentId,
  handleEditSubmit,
  rating,
}: Props): JSX.Element => {
  const { user, text, userId, id } = comment;
  const { user: userData } = useAuth();
  const [editMode, setEditMode] = useState(false);

  function toggleEditMode() {
    if (editMode) {
      setEditMode((prev) => !prev);
      return;
    }
    setEditMode((prev) => !prev);
    handleSetEditCommentId(id);
  }

  function saveChanges() {
    handleEditSubmit();
    setEditMode((prev) => !prev);
  }

  return (
    <div className="flex flex-col border rounded-md border-neutral-500  p-4 ">
      {/* <Image width={40} height={40} src={userPhoto} alt="user avatar" /> */}
      {!editMode && (
        <div className="space-y-2">
          {rating.userId !== "not available" && (
            <Rating
              rating={{ rate: rating.rating, count: 0 }}
              commentRating={true}
            />
          )}
          <p className="text-sm font-semibold text-neutral-200">{text}</p>
          <p className=" text-neutral-400 text-sm">{user}</p>
        </div>
      )}
      {editMode && (
        <div>
          <p>{user}</p>
          <div className="flex flex-col space-y-2 mt-8">
            <textarea
              onChange={(e) => handleEditChange(e.target.value)}
              className="w-full border rounded-md border-neutral-500 resize-none p-2 focus:border-primary-500"
            >
              {text}
            </textarea>
            <div className="ml-auto">
              <Button
                text="Save changes"
                type="primary"
                size="sm"
                onClick={saveChanges}
              />
            </div>
          </div>
        </div>
      )}
      {user && userData != null && userId === userData.uid && (
        <div className="flex space-x-4 pt-2 ml-auto">
          <button
            className="text-sm fa fa-edit text-neutral-200 hover-hover:hover:text-neutral-600 transition-all "
            onClick={toggleEditMode}
          ></button>
          <button
            className="text-sm fa fa-trash text-danger-500 hover-hover:hover:text-danger-600 opacity-75 transition-all"
            onClick={() => deleteComment(id)}
          ></button>
        </div>
      )}
    </div>
  );
};

export default Comment;
