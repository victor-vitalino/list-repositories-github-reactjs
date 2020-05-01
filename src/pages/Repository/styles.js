import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
    from {
        transform:rotate(0deg)
    }
    to{
        transform:rotate(360deg)
    }

`;
export const Loading = styled.div`
    color: ${(props) => props.textColor};
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    svg {
        animation: ${rotate} 1s linear infinite;
    }
`;

export const Owner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 120px;
        border-radius: 50%;
        margin-top: 20px;
    }
    h1 {
        font-size: 24px;
        margin-top: 10px;
    }
    p {
        margin-top: 5px;
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        text-align: center;
        max-width: 400px;
    }
    a {
        color: #7159c1;
        font-size: 16px;
        text-decoration: none;
    }
`;

export const IssueList = styled.ul`
    padding-top: 15px;
    margin-top: 15px;
    border-top: 1px solid #eee;
    list-style: none;

    li {
        display: flex;
        padding: 15px 10px;
        border: 1px solid #eee;
        border-radius: 4px;

        & + li {
            margin-top: 10px;
        }

        img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #eee;
        }

        div {
            flex: 1;
            margin-left: 15px;

            strong {
                font-size: 16px;

                a {
                    text-decoration: none;
                    color: #333;
                    :hover {
                        color: #7159c1;
                    }
                }
                span {
                    background: #eee;
                    color: #333;
                    border-radius: 2px;
                    font-size: 12px;
                    font-weight: 600;
                    height: 20px;
                    padding: 3px 4px;
                    margin-left: 10px;
                }
            }

            p {
                margin-top: 5px;
                font-size: 12px;
                color: #999;
            }
        }
    }
`;

export const IssueFilter = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-top: 15px;

    div {
        display: flex;
        padding-left: 15px;
        align-items: center;
        justify-content: center;

        input {
            color: #222;
            border: 2px solid #222;
            height: 16px;
            content: '✓';
        }
    }
`;

export const Pagination = styled.div`
    margin: 15px 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    strong {
        font-size: 30px;
        color: #7159c1;
    }
`;

export const Page = styled.button`
    background: #fff;
    border: none;

    :hover {
        opacity: 0.7;
    }
    svg {
        color: #7159c1;
        transform: ${(props) => props.back && 'rotate(180deg)'};
        opacity: ${(props) => props.disabled && '0.1'};
    }
`;
