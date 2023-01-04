import { gql, useMutation } from "@apollo/client";
import { getIdFromLocalCookie, getTokenFromLocalCookie } from "lib/auth";
import { CommentInterface, RatedByInterface } from "Models";
import { COMMENTS, DELETE_COMMENT, UPDATE_COMMENT } from "../gqlQueries";
import { client } from "pages/_app";
import { useEffect, useState } from "react";
import Button from "./Button";
import Rating from "./Rating";

interface Props {
  comment: CommentInterface;
  handleSetEditCommentId: (val: string) => void;
  rating: RatedByInterface;
  editCommentId: string;
}

/* eslint-disable jsx-a11y/alt-text */
const Comment = ({
  comment,
  handleSetEditCommentId,
  rating,
  editCommentId,
}: Props): JSX.Element => {
  const { user, text, userId, id, userRating } = comment;
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [editText, setEditText] = useState("");
  // Get the user's ID
  useEffect(() => {
    const getUserId = async () => {
      const result = await getIdFromLocalCookie();
      if (!result) return;
      setCurrentUserId(result.toString());
    };

    getUserId();
  }, []);

  // Update Comment
  const [
    updateCommentApollo,
    { error: updateCommentError, loading: updateCommentLoading },
  ] = useMutation(UPDATE_COMMENT, {
    variables: {
      text: editText,
      id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
  });
  // Delete Comment
  const [
    deleteCommentApollo,
    { error: deleteCommentError, loading: deleteCommentLoading },
  ] = useMutation(DELETE_COMMENT, {
    variables: {
      id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
  });
  // Toggle edit + disable other comment's buttons ?
  function toggleEditMode() {
    if (editMode) {
      setEditMode((prev) => !prev);
      handleSetEditCommentId("");
      return;
    }
    setEditMode((prev) => !prev);
    handleSetEditCommentId(id);
  }

  function saveChanges() {
    setEditText("");
    toggleEditMode();
    updateCommentApollo();
    client.refetchQueries({ include: [COMMENTS] });
  }

  const deleteComment = () => {
    deleteCommentApollo();
    client.refetchQueries({ include: [COMMENTS] });
  };

  if (deleteCommentLoading || updateCommentLoading) return <h1>loading...</h1>;
  if (deleteCommentError || updateCommentError) return <h1>error...</h1>;

  return (
    <div className="flex flex-col border rounded-md border-neutral-500  p-4 ">
      {/* <Image width={40} height={40} src={userPhoto} alt="user avatar" /> */}
      {!editMode && (
        <div className="space-y-2">
          {userRating !== 0 && (
            <Rating
              rating={{ rate: userRating, count: 0 }}
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
              onChange={(e) => setEditText(e.target.value)}
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
      {userId === currentUserId && (
        <div className="flex space-x-4 pt-2 ml-auto">
          <button
            disabled={id !== editCommentId && editCommentId !== ""}
            className={`text-sm fa fa-edit text-neutral-200 hover-hover:hover:text-neutral-600 transition-all`}
            onClick={toggleEditMode}
          ></button>
          <button
            className="text-sm fa fa-trash text-danger-500 hover-hover:hover:text-danger-600 opacity-75 transition-all"
            onClick={deleteComment}
          ></button>
        </div>
      )}
    </div>
  );
};

export default Comment;
