import { CommentInterface, RatedByInterface } from "Models";
import Comment from "./Comment";

interface Props {
  comments: CommentInterface[];
  handleSetEditCommentId: (val: string) => void;
  ratedByData: RatedByInterface[];
  editCommentId: string;
}

const CommentsList = ({
  comments,
  handleSetEditCommentId,
  editCommentId,
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
            handleSetEditCommentId={handleSetEditCommentId}
            editCommentId={editCommentId}
          />
        );
      })}
    </div>
  );
};

export default CommentsList;
