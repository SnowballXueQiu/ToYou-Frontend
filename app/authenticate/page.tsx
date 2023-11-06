'use client'

import {Card, CardBody, CardFooter, Spinner} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React, {ReactNode, useState} from "react";
import {Input} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import {checkEmail, creatUser} from "@/interface/api";
import {Message} from "@/components/message";

type colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;

export default function Page() {
    let [buttonColor, setButtonColor] = useState<colors>("default");
    let [buttonDisable, setButtonDisable] = useState(true);
    let [state, setState] = useState("email");

    let [emailInvalid, setEmailInvalid] = useState(true);
    let [emailErrorMessage, setEmailErrorMessage] = useState("请输入邮箱");

    let [email, setEmail] = useState("");
    let [code, setCode] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [username, setUsername] = useState("");

    function getAdditionalInput(state: string): ReactNode {
        if (state == "login") {
            return (
                <Input key={"password"} type="password" label="密码" placeholder="密码" style={{width: 300}}
                       onChange={(e) => {
                           setPassword(e.target.value);
                       }}/>
            );
        } else if (state == "register") {
            return (
                <div className="space-y-5">
                    <div className="flex space-x-3" style={{width: "auto", display: "flex"}}>
                        <Input key={"code"} onChange={(e) => {
                            setCode(e.target.value)
                        }} type="text" label="验证码" placeholder="验证码" style={{height: "auto", flex: 3}}
                               endContent={
                            <></>
                                   // <Button size={"sm"} style={{position: "relative", top: -7.5}}>发送验证码</Button>
                               }/>
                    </div>

                    <Input key="username" placeholder="用户名" label="用户名" onChange={(e) => {
                        setUsername(e.target.value);
                    }}/>

                    <div className="flex space-x-3">
                        <Input key="password-reg" type="password" placeholder="密码" label="密码" onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                        <Input key="password-reg2" type="password" placeholder="确认密码" label="确认密码"
                               onChange={(e) => {
                                   setConfirmPassword(e.target.value);
                               }}/>
                    </div>
                </div>

            );
        } else {
            return (
                <></>
            );
        }
    }

    // @ts-ignore
    return (
        <div>
            <Card>
                <CardBody>
                    <div className="space-y-5">
                        <Input key={"email"} isInvalid={emailInvalid} errorMessage={emailErrorMessage} type="email"
                               label="邮箱" placeholder="邮箱" style={{width: 300}} onChange={
                            (e) => {
                                let value = e.target.value;

                                if (value.length == 0) {
                                    setEmailInvalid(true);
                                    setEmailErrorMessage("请输入邮箱");
                                } else if (!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/i)) {
                                    setEmailInvalid(true);
                                    setEmailErrorMessage("邮箱格式不正确");
                                } else {
                                    setEmailInvalid(false);
                                    setEmailErrorMessage("");
                                }

                                setEmail(value);
                                setState("email");
                            }
                        }/>
                        {getAdditionalInput(state)}
                        <Checkbox onChange={(e) => {
                            let checked = e.target.checked;
                            setButtonDisable(!checked);
                            setButtonColor(checked ? "primary" : "default");
                        }}>登录或注册即代表同意服务条款</Checkbox>
                    </div>
                </CardBody>
                <CardFooter>
                    <Button style={{position: "relative", left: 7}} color={buttonColor} disabled={buttonDisable}
                            onClick={
                                () => {
                                    // Message.message("message");
                                    // Message.success("success");
                                    // Message.warning("warning");
                                    // Message.error("error");
                                    // return;
                                    if (state == "email") {
                                        if (emailInvalid) {
                                            Message.error(emailErrorMessage);
                                            return;
                                        }
                                        setState("loading");
                                        setButtonDisable(true);
                                        checkEmail(email).then(r => {
                                            setState(r ? "login" : "register")
                                            setButtonDisable(false);
                                            if (!r) {
                                                Message.message("验证码已发送")
                                            }
                                        });
                                    }
                                    else if (state == "register") {
                                        setState("loading");
                                        setButtonDisable(true);
                                        if (password != confirmPassword) {
                                            Message.error("密码输入不一致")
                                        }
                                        creatUser(email, password, username, code).then(r => {
                                            var [status, message] = r;
                                            if (status) {
                                                Message.success("注册成功，请登录");
                                                setState("login");
                                                setEmail("");
                                                setUsername("");
                                                setPassword("");
                                            } else {
                                                Message.error(message);
                                            }
                                            setButtonDisable(false);
                                        })
                                    }
                                }
                            }>
                        {state == "loading" ?
                            <div className="justify-center flex space-x-3"><Spinner color="default" size="sm"/><p>加载中...</p></div> : state == "email" ? "下一步" : state == "login" ? "登录" : "注册"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
