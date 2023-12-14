import React from "react";

import { useConfigs } from "../../core/configsContext";
import { Form, Image, Badge } from "react-bootstrap";

import './Profile.css';


export default function Profile() {
    const { user } = useConfigs();

    return (<>
        <div className="centerize fade-in-long Container">

            <div className="flex vertical gap-2 Card">

                <div className="User flex align-center justify-center gap-4">
                    <span className="name">{user.name}</span>
                    <Image
                        src={user.picture}
                        roundedCircle
                        className="ml-2"
                        style={{width: '80px', height: '80px'}}
                    />

                </div>

                <div className="flex justify-start">
                    <span>
                        1 recipe(s)
                    </span>
                </div>

                <div>
                    <div className="Badges-Container flex gap-2">
                        <Badge className="Badge" bg="dark">
                            pasta
                        </Badge>
                        <Badge className="Badge" bg="dark">
                            meat
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    </>);
}