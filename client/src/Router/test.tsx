import * as React from "react"
import { 
	useUpdateUserMutation,
	useGetUserMutation
} from "../Api/User/userApiSlice"
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { Button, Avatar } from '@mui/material';
import useSimpleRequest from '../Api/useSimpleRequest';
import useAlert from "../Hooks/useAlert";
import axios from "axios";
import { AvatarUpload } from "../Components/AvatarUpload";

// const AvatarUpload = () => {
// 	const [file, setFile] = React.useState('')

// 	const handleChange = (event: any) => {
// 		setFile(URL.createObjectURL(event.target.files[0]))
// 	}
// 	return (
// 		<div>
// 		  <input type="file" onChange={handleChange}/>
// 		  <Avatar 
// 		  	src={file}
// 			sx={{ width: 100, height: 100 }}
// 			/>
// 		</div>
// 	)
// }

const UploadFile = () => {
    const [file, setFile] = React.useState<any>();

    const onChange = (file: React.ChangeEvent) => {
        const { files } = file.target as HTMLInputElement;
        if (files && files.length !== 0) {
          setFile(files[0]);
        }
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file)
        const upload = await axios({
            url:"http://localhost:3000/upload",
            method:"post",
            // headers:{
            //     Authorization: `Bearer your token`
            // },
            data: formData
        }).then((r: any) => r);
        console.log(upload);
    }

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input type="file" onChange={onChange} />
                <button onClick={handleUpload}>upload</button>
            </form>
        </div>
    )
}



export function Dashboard() {
	const currentUser = useSelector(selectCurrentUser)
	const userData = useSimpleRequest(useGetUserMutation, 1)
	const [updateUser, {
		data: data,
		isLoading,
		isError,
		isSuccess,
		error
	}] = useUpdateUserMutation()
	// const userData = useSimpleRequest(useGetUsersMutation, {})
	let Content =() => <p>{JSON.stringify(userData)}</p> 
	
	const handleSubmit = (e: any) => {
		e.preventDefault()
		const input = {
			id: currentUser.userId,
			newUserData: {
				username: "test",
				login: "test"
			}
		}
		updateUser(input)
	}
	return (
		<div>
			<h1>Dashboard</h1>
			 <Content></Content>
			 <UploadFile/>
			 {/* <AvatarUpload/> */}
			 {/* <img src="http://localhost:3000/file/avatar/test.png"></img> */}
		</div>
	);
}
