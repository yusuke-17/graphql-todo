import { IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

function DeleteTask({ id, useId }: { id: number; useId: number }) {
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: useId } }],
      });
      alert("Task deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        localStorage.removeItem("token");
        alert("Please login again");
        navigate("/signin");
        return;
      }

      alert(error.message);
    }
  };
  return (
    <div>
      <Tooltip title="Edit">
        <IconButton onClick={handleDelete}>
          <Delete color="action" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default DeleteTask;
