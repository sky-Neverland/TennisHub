import { Select } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import React from "react";
import { IUser } from "./types";

interface UserSelectProps {
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    users: IUser[];
}
const UserSelect = ({ setUserId, users }: UserSelectProps) => (
    <Select
        w="300px"
        m="md"
        placeholder="Select user"
        icon={<IconUsers size={16} />}
        data={users.map((user) => {
            return {
                value: user.userid,
                label: user.lastname + " " + user.firstname,
            };
        })}
        onChange={(value) => {
            value && setUserId(value);
        }}
    />
);

export default UserSelect;
