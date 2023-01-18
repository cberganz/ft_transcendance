import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import "./ConnectedUsers.css";
import Button from "@mui/material/Button";
import invitationGame from "../Game/components/Invitation/Invitation";
import { useNavigate } from "react-router-dom";
import spectateGame from "../Game/components/Spectate/Spectate";
import Label from './Label';

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
        let label_color: "success" | "error";
        params.value === "offline"
          ? (label_color = "error")
          : (label_color = "success");
		return<Label color={label_color}>{params.value}</Label>
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
	<Box sx={{
	borderTopRightRadius: "20px",
	borderTopLeftRadius: "20px",
	paddingTop: "30px",
	backgroundColor: "white",
	borderBlockColor: "#F9FAFB",
	borderBlockStartColor: "#F9FAFB",
	}}>
		<Box sx={{ display: "flex", alignItems: 'left', marginLeft: "2vw"}}>
			<Typography sx={{ paddingBottom: "30px", fontWeight: "bold" }}>
				Connected Users :
			</Typography>
		</Box>
		<div>
			<Stack>
				<Box className="data-grid">
					<DataGrid
					className="grid"
					sx={{
						'& .MuiDataGrid-cell': {
							borderColor: '#f4f4f4',
						},
						'.MuiDataGrid-columnSeparator': {
						display: 'none',
						},
						'&.MuiDataGrid-root': {
						border: 'none',
						},
					}}			
					rows={props.allUsersTab}
					columns={columns}
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					getRowId={(row: any) => row.id}
					/>
				</Box>
			</Stack>
		</div>
	</Box>
  );
}

