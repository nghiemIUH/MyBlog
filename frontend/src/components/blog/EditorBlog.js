import React, { useState } from "react";
import clsx from "clsx";
import style from "./Editor.module.scss";

import MDEditor from "@uiw/react-md-editor";
import katex from "katex";
import "katex/dist/katex.css";

function EditorBlog() {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const titleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
    };
    const contentChange = (content) => {
        setContent(content);
    };
    const handleSubmit = () => {
        const element = document.querySelector(".w-md-editor-preview");
        console.log(element.outerHTML);
    };
    return (
        <div>
            <div className={clsx(style.editor)}>
                <input
                    className="Editor__Title"
                    placeholder="Tiêu đề ..."
                    required
                    onChange={titleChange}
                />
                <MDEditor
                    value={content}
                    onChange={contentChange}
                    previewOptions={{
                        components: {
                            code: ({
                                inline,
                                children = [],
                                className,
                                ...props
                            }) => {
                                const txt = children[0] || "";
                                if (inline) {
                                    if (
                                        typeof txt === "string" &&
                                        /^\$\$(.*)\$\$/.test(txt)
                                    ) {
                                        const html = katex.renderToString(
                                            txt.replace(/^\$\$(.*)\$\$/, "$1"),
                                            {
                                                throwOnError: false,
                                            }
                                        );
                                        return (
                                            <code
                                                dangerouslySetInnerHTML={{
                                                    __html: html,
                                                }}
                                            />
                                        );
                                    }
                                    return <code>{txt}</code>;
                                }
                                if (
                                    typeof txt === "string" &&
                                    typeof className === "string" &&
                                    /^language-katex/.test(
                                        className.toLocaleLowerCase()
                                    )
                                ) {
                                    const html = katex.renderToString(txt, {
                                        throwOnError: false,
                                    });
                                    return (
                                        <code
                                            dangerouslySetInnerHTML={{
                                                __html: html,
                                            }}
                                        />
                                    );
                                }
                                return (
                                    <code className={String(className)}>
                                        {txt}
                                    </code>
                                );
                            },
                        },
                    }}
                />
                <button
                    className="Editor__BtnPost"
                    disabled={
                        content === "" ||
                        content === "<p><br></p>" ||
                        title === ""
                    }
                    onClick={handleSubmit}
                >
                    Đăng bài
                </button>
            </div>
        </div>
    );
}

export default EditorBlog;
