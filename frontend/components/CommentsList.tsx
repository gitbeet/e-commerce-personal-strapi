import { CommentInterface, RatedByInterface } from "Models";
import Comment from "./Comment";

interface Props {
  comments: CommentInterface[];
  deleteComment: (val: string) => void;
  handleEditChange: (val: string) => void;
  handleSetEditCommentId: (val: string) => void;
  handleEditSubmit: () => void;
  ratedByData: RatedByInterface[];
}

const CommentsList = ({
  comments,
  deleteComment,
  handleEditChange,
  handleSetEditCommentId,
  handleEditSubmit,
  ratedByData,
}: Props): JSX.Element => {
  const ratingNotAvailable = {
    rating: 5,
    userId: "not available",
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        return (
          <Comment
            rating={
              ratedByData.find((rating) => rating.userId === comment.userId) ||
              ratingNotAvailable
            }
            key={comment.id}
            comment={comment}
            deleteComment={deleteComment}
            handleEditChange={handleEditChange}
            handleSetEditCommentId={handleSetEditCommentId}
            handleEditSubmit={handleEditSubmit}
          />
        );
      })}
    </div>
  );
};

export default CommentsList;
