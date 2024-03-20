import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Navigate, Link } from 'react-router-dom';
import queryString from 'query-string';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import withRouter from 'app/withRouter';
import { AnimatedCount, SearchBox } from 'components/common';
import { fetchStatistics } from 'actions/index';
import { selectMetadata, selectSession, selectStatistics } from 'selectors';
import Screen from 'components/Screen/Screen';
import wordList from 'util/wordList';

import './HomeScreen.scss';

const messages = defineMessages({
  title: {
    id: 'home.title',
    defaultMessage: 'Find public records and leaks',
  },
  about: {
    id: 'home.about',
    defaultMessage: 'Acerca de Cuba Investiga',
  },
  access_disabled: {
    id: 'home.access_disabled',
    defaultMessage: 'Public access temporarily disabled',
  },
  placeholder: {
    id: 'home.placeholder',
    defaultMessage: 'Pruebe buscar: {samples}',
  },
  count_entities: {
    id: 'home.counts.entities',
    defaultMessage: 'Entidades',
  },
  count_datasets: {
    id: 'home.counts.datasets',
    defaultMessage: 'Conjuntos de datos',
  },
  count_countries: {
    id: 'home.counts.countries',
    defaultMessage: 'Countries & territories',
  },
  count_documents: {
    id: 'collection.info.documents',
    defaultMessage: 'Documentos',
  },
});

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // for now, always load
    this.props.fetchStatistics();
  }

  onSubmit(queryText) {
    const { navigate } = this.props;
    navigate({
      pathname: '/search',
      search: queryString.stringify({
        q: queryText,
      }),
    });
  }

  render() {
    const { intl, metadata, statistics = {}, session } = this.props;
    if (session.loggedIn) {
      return <Navigate to="/notifications" replace />;
    }

    const appHomePage = metadata.pages.find((page) => page.home);
    const { description, samples, title } = appHomePage;
    const samplesList = wordList(samples, ', ').join('');

    return (
      <Screen
        title={intl.formatMessage(messages.title)}
        description={description}
        exemptFromRequiredAuth
      >
        <div className="HomeScreen">
          <section className="HomeScreen__section title-section">
            <div className="HomeScreen__section__content">
              <h1 className="HomeScreen__app-title">{title}</h1>
              {description && (
                <p className="HomeScreen__description">{description}</p>
              )}
              <div className="HomeScreen__search">
                <SearchBox
                  onSearch={this.onSubmit}
                  placeholder={intl.formatMessage(messages.placeholder, {
                    samples: samplesList,
                  })}
                  inputProps={{ large: true, autoFocus: true }}
                />
                <div className="HomeScreen__thirds">
                  <AnimatedCount
                    count={87500000}
                    isPending={statistics.isPending}
                    label={intl.formatMessage(messages.count_entities)}
                  />
                  <AnimatedCount
                    count={40}
                    isPending={statistics.isPending}
                    label={intl.formatMessage(messages.count_datasets)}
                  />
                  <AnimatedCount
                    count={115171}
                    isPending={statistics.isPending}
                    label={intl.formatMessage(messages.count_documents)}
                  />
                </div>
              </div>
            </div>
          </section>
          {appHomePage?.content && (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {appHomePage.content}
            </ReactMarkdown>
          )}
          <section className="HomeScreen__section">
            <div className="HomeScreen__section__content">
              <p className="HomeScreen__paragraph--center">
                <a
                  className="HomeScreen__mailto"
                  href="mailto:cubainvestiga@proyectoinventario.org"
                >
                  cubainvestiga@proyectoinventario.org
                </a>
              </p>
              <p className="HomeScreen__paragraph--center">
                pgp:{' '}
                <a href="https://keys.openpgp.org/search?q=cubainvestiga@proyectoinventario.org">
                  0x43E689E22CC902F4
                </a>
              </p>
              <p className="HomeScreen__paragraph--center">
                Una herramienta de{' '}
                <a href="https://proyectoinventario.org/">
                  Proyecto Inventario
                </a>
              </p>
              <p className="HomeScreen__paragraph--center">
                Desarrollado por{' '}
                <a href="https://investigativedata.io">investigativedata.io</a>
              </p>
              <p className="HomeScreen__paragraph--center">
                <Link to="/pages/about">Más información</Link>
              </p>
              <h1 className="HomeScreen__title">
                {intl.formatMessage(messages.about)}
              </h1>
              <div className="HomeScreen__thirds">
                Cuba Investiga es una herramienta para hacer periodismo de
                investigación sobre Cuba.<br />
                <Link to="/pages/about">Más información</Link>
              </div>
            </div>
          </section>
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  statistics: selectStatistics(state),
  session: selectSession(state),
  metadata: selectMetadata(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps, { fetchStatistics }),
  injectIntl
)(HomeScreen);
