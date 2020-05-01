import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

import api from '../../services/api';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        failed: false,
        error: '',
    };

    // carregar dados
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');
        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    // salvar os dados
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = (e) => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });

        const { newRepo, repositories } = this.state;

        try {
            const repoExists = repositories.find(
                (repo) => repo.name === newRepo
            );

            if (repoExists) {
                throw new Error('Repositório duplicado');
            }

            const response = await api.get(`/repos/${newRepo}`);
            const data = {
                name: response.data.full_name,
            };
            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
                failed: false,
                error: '',
            });
        } catch (error) {
            let msg = '';
            if (error.message === 'Request failed with status code 404') {
                msg = 'Repositório não encontrado!';
            } else {
                msg = error.message;
            }
            this.setState({
                loading: false,
                failed: true,
                error: msg,
            });
        }
    };

    render() {
        const { newRepo, repositories, loading, failed, error } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit} failed={failed}>
                    <div>
                        <input
                            type="text"
                            placeholder="Adicionar Repositórios"
                            value={newRepo}
                            onChange={this.handleInputChange}
                        />

                        <SubmitButton loading={loading}>
                            {loading ? (
                                <FaSpinner color="#fff" size={14} />
                            ) : (
                                <FaPlus color="#fff" size={14} />
                            )}
                        </SubmitButton>
                    </div>
                    {error && <p>{error}</p>}
                </Form>
                <List>
                    {repositories.map((repository) => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
