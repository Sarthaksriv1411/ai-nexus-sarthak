import { useEffect, useRef, useState } from 'react'
import './prompt.css'
import Upload from '../upload/Upload';
import { IKImage } from "imagekitio-react";
import model from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader } from 'rsuite';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const NewPrompt = ({ data }) => {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}

    });
    const chat = model.startChat({
        history: data?.history?.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }],
        })) || [{ role: "user", parts: [{ text: "Hello!" }] }], // Default fallback
        generationConfig: {
            // maxOutputTokens: 100,
        }
    });


    const endRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: 'smooth' }, [data, question, answer, img.dbData]);
    })

    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer: answer,
                    img: img.dbData?.filePath || undefined,

                })
            }).then(res => res.json());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['chat', data._id],
            }).then(res => res.json());
            formRef.current.reset();
            setQuestion("");
            setAnswer("");
            setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {}
            });
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const add = async (text, isInitial) => {

        if (!isInitial) {
            setQuestion(text);
        }
        try {
            const result = await chat.sendMessageStream(Object.entries(img.dbData).length ? [img.aiData, text] : [text]);

            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }
            mutation.mutate();
        }
        catch (err) {
            console.log(err);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        add(text, false);
    }

    // IN PRODUCTION WE DON'T NEED IT
    const hasRun = useRef(false);
    useEffect(() => {
        if (!hasRun.current) {
            if (data?.history?.length === 1) {
                add(data.history[0].parts[0].text, true);
            }
        }
        hasRun.current = true;
    }, []);

    return (
        <>
            {/* Add new Chat */}
            {img.isLoading && (
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="150"
                />
            )}
            {question && <div className='message user'>{question} </div>}
            {answer && <div className='message '>
                <Markdown>
                    {answer}
                </Markdown>
            </div>}

            <div className='endChat' ref={endRef}>
                <div className='container'>
                    <hr className='hr-text' data-content="End of the Chat" />
                </div>
            </div>



            <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg={setImg} />
                <input id='file' type="file" multiple={false} hidden />
                <input type="text" placeholder='Type your message here...' name='text' />
                <button>
                    <img src="/arrow.png" className="arrow" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt