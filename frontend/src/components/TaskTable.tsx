import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Task } from "../types/task";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { Stack } from "@mui/material";

export default function TaskTable({
  tasks,
  userId,
}: {
  tasks: Task[] | undefined;
  userId: number;
}) {
  return (
    <TableContainer component={Paper} sx={{ width: "80%", m: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align="right">Due Date</TableCell>
            <TableCell align="right">Statue</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow
              key={task.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="task">
                {task.name}
              </TableCell>
              <TableCell align="right">{task.dueDate}</TableCell>
              <TableCell align="right">{task.status}</TableCell>
              <TableCell align="right">
                <Stack
                  spacing={2}
                  direction={"row"}
                  justifyContent={"flex-end"}
                >
                  <EditTask task={task} userId={userId} />
                  <DeleteTask id={task.id} useId={userId} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
