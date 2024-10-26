import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../types/task";
import { TaskStatus } from "../types/taskStatus";
import { UPDATE_TASK } from "../mutations/taskMutations";
import { useMutation } from "@apollo/client";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function EditTask({
  task,
  userId,
}: {
  task: Task;
  userId: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);

  const navigate = useNavigate();

  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);

  const resetState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setDescription(task.description);
    setStatus(task.status);
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleEditTask = async () => {
    let canEdit = true;
    if (name.length === 0) {
      canEdit = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      canEdit = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    if (canEdit) {
      const updateTaskInput = {
        id: task.id,
        name,
        dueDate,
        status,
        description,
      };
      try {
        await updateTask({
          variables: { updateTaskInput },
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
    resetState();
    setOpen(true);
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Edit">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="task-status-label">Status</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value={"NOT_STARTED"}>NOT_STARTED</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>IN_PROGRESS</MenuItem>
              <MenuItem value={"COMPLETED"}>COMPLETED</MenuItem>
            </Select>
          </FormControl>
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
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
