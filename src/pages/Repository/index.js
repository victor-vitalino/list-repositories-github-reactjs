import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner, FaPlay } from 'react-icons/fa';

import api from '../../services/api';
import {
    Loading,
    Owner,
    IssueList,
    IssueFilter,
    Pagination,
    Page,
} from './styles';
import Container from '../../components/Container';

const LoadingData = ({ color, text }) => (
    <Loading textColor={color}>
        <FaSpinner color={color} size={30} />
        {text}
    </Loading>
);

class Repository extends Component {
    state = {
        repository: {},
        issues: [],
        loading: true,
        isChecked: 'all',
        status: 'all',
        loadingIssues: false,
        page: 1,
        disabledPage: false,
    };

    async componentDidMount() {
        const { match } = this.props;
        const { status, page } = this.state;
        const repoName = decodeURIComponent(match.params.repository);

        if (page === 1) {
            this.setState({ disabledPage: true });
        }

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            this.handleApi(repoName, status, page),
        ]);
        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
    }

    handleApi = async (repoName, status, page) =>
        api.get(`/repos/${repoName}/issues?page=${page}`, {
            params: {
                state: status,
                per_page: 5,
            },
        });

    handleStatus = async (e) => {
        this.setState({
            isChecked: e.target.value,
            status: e.target.value,
            loadingIssues: true,
        });
        const { match } = this.props;
        const { status } = this.state;
        const repoName = decodeURIComponent(match.params.repository);

        const issues = await this.handleApi(repoName, status);
        this.setState({
            loadingIssues: false,
            issues: issues.data,
        });
    };

    handlePagination = async (action) => {
        let { page } = this.state;
        if (action === 'back' && page === 1) {
            return null;
        }
        if (action === 'next') {
            page += 1;
            this.setState({ disabledPage: false });
        } else {
            page -= 1;
        }
        this.setState({
            loadingIssues: true,
            page,
        });
        const { match } = this.props;
        const { status } = this.state;
        const repoName = decodeURIComponent(match.params.repository);
        const issues = await this.handleApi(repoName, status, page);

        this.setState({
            loadingIssues: false,
            issues: issues.data,
        });
        if (page === 1) {
            this.setState({ disabledPage: true });
        }
    };

    render() {
        const {
            repository,
            issues,
            loading,
            loadingIssues,
            isChecked,
            page,
            disabledPage,
        } = this.state;
        if (loading) {
            return LoadingData({ color: '#fff', text: 'Carregando' });
        }

        return (
            <Container>
                <Owner>
                    <Link to="/">Voltar aos Repositórios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <IssueFilter>
                    <strong>Status:</strong>
                    <div>
                        <input
                            type="radio"
                            value="all"
                            checked={isChecked === 'all'}
                            onChange={this.handleStatus}
                        />
                        All
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="closed"
                            checked={isChecked === 'closed'}
                            onChange={this.handleStatus}
                        />
                        Closed
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="open"
                            checked={isChecked === 'open'}
                            onChange={this.handleStatus}
                        />
                        Open
                    </div>
                </IssueFilter>

                {loadingIssues ? (
                    LoadingData({ color: '#222', text: 'Carregando issues' })
                ) : (
                    <IssueList>
                        {issues.map((issue) => (
                            <li key={String(issue.id)}>
                                <img
                                    src={issue.user.avatar_url}
                                    alt={issue.user.login}
                                />
                                <div>
                                    <strong>
                                        <a href={issue.html_url}>
                                            {issue.title}
                                        </a>
                                        {issue.labels.map((label) => (
                                            <span key={String(label.id)}>
                                                {label.name}
                                            </span>
                                        ))}
                                    </strong>
                                    <p>{issue.user.login}</p>
                                </div>
                            </li>
                        ))}
                    </IssueList>
                )}
                <Pagination>
                    <Page
                        back
                        disabled={disabledPage}
                        onClick={() => this.handlePagination('back')}
                    >
                        <FaPlay size={30} />
                    </Page>
                    <strong>{page}</strong>
                    <Page onClick={() => this.handlePagination('next')}>
                        <FaPlay color="#7159c1" size={30} />
                    </Page>
                </Pagination>
            </Container>
        );
    }
}

// definição das proptypes
Repository.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            repository: PropTypes.string,
        }),
    }).isRequired,
};

LoadingData.propTypes = {
    color: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default Repository;
