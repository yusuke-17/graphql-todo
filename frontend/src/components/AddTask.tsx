import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@apollo/client";
import { Task } from "../types/task";
import { CREATE_TASK } from "../mutations/taskMutations";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function AddTask({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);

  const navigate = useNavigate();

  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK, {});

  const resetState = () => {
    setName("");
    setDueDate("");
    setDescription("");
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleAddTask = async () => {
    let canAdd = true;
    if (name.length === 0) {
      canAdd = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      canAdd = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    if (canAdd) {
      const createTaskInput = {
        name,
        dueDate,
        description,
        userId,
      };
      try {
        await createTask({
          variables: { createTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
        });
        resetState();
        setOpen(false);
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
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ width: "270px" }}
        onClick={handleClickOpen}
      >
        Add Task
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName ? "Task name cannot be empty" : ""}
          />
          <TextField
            autoFocus
            margin="normal"
            id="due-date"
            label="Due date"
            placeholder="YYYY-MM-DD"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidDueDate ? "Due must be a valid date" : ""}
          />
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
