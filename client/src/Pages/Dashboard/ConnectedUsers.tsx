import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import "./ConnectedUsers.css";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import invitationGame from "../Game/components/Invitation/Invitation";
import { useNavigate } from "react-router-dom";
import spectateGame from "../Game/components/Spectate/Spectate";

export default function ConnectedUsers(props: any) {
  const navigate = useNavigate();
  const getId = (username: string) => {
    for (let user of props.allUsersTab) {
      if (user.User === username) return user.id;
    }
    return -1;
  };

  const handleClickGame = (param: any) => {
    navigate("/game");
    invitationGame(param);
  };

  const handleClickView = (param: any) => {
    navigate("/game");
    spectateGame(param);
  };

  const columns: GridColDef[] = [
    {
      field: "User",
      headerName: "User",
      minWidth: 120,
      editable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <b
            onClick={() =>
              props.navigate("/profile?userId=" + getId(params.value))
            }
            style={{ cursor: "pointer" }}
          >
            {params.value}
          </b>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      editable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let chip_color: "primary" | "warning";
        params.value === "offline"
          ? (chip_color = "warning")
          : (chip_color = "primary");
        return <Chip color={chip_color} label={params.value}></Chip>;
      },
    },
    {
      field: "playgame",
      headerName: "Play Game",
      minWidth: 120,
      editable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let chip_color: "primary" | "warning";
        params.value === "Play"
          ? (chip_color = "primary")
          : (chip_color = "warning");
        return params.value === "Play" ? (
          <Button onClick={() => handleClickGame(params.id)} color={chip_color}>
            {" "}
            {params.value}{" "}
          </Button>
        ) : (
          <Button onClick={() => handleClickView(params.id)} color={chip_color}>
            {" "}
            {params.value}{" "}
          </Button>
        );
      },
    },
  ];
  
  return (
    <div>
      <Stack>
        <Box className="data-grid">
          <DataGrid
            className="grid"
            rows={props.allUsersTab}
            columns={columns}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            getRowId={(row: any) => row.id}
          />
        </Box>
      </Stack>
    </div>
  );
}
