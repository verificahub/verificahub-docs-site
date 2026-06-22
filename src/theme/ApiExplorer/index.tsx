import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CodeBlock from '@theme/CodeBlock';
import CodeSnippets from '@theme/ApiExplorer/CodeSnippets';
import SecuritySchemes from '@theme/ApiExplorer/SecuritySchemes';
import {useTypedDispatch, useTypedSelector} from '@theme/ApiItem/hooks';
import {setServer} from '@theme/ApiExplorer/Server/slice';
import type {ApiItem} from 'docusaurus-plugin-openapi-docs/src/types';
import * as sdk from 'postman-collection';

/**
 * Swizzled (ejected) API explorer. The upstream theme renders an interactive
 * "try-it" Request form + live Response panel; we drop both for a cleaner,
 * docs-first right rail: auth summary → request code samples ("Пример запроса")
 * → response example ("Пример ответа"), à la the T-Bank dev portal.
 */
const asJson = (ex: unknown): string =>
  typeof ex === 'string' ? ex : JSON.stringify(ex, null, 2);

function getRequestExample(item: NonNullable<ApiItem>): string | null {
  const ex = (item as any).requestBody?.content?.['application/json']?.example;
  return ex === undefined ? null : asJson(ex);
}

function getResponseExample(
  item: NonNullable<ApiItem>,
): {code: string; body: string} | null {
  const responses = (item as any).responses ?? {};
  const code = Object.keys(responses).find((c) => /^2\d\d$/.test(c));
  if (!code) return null;
  const ex = responses[code]?.content?.['application/json']?.example;
  if (ex === undefined) return null;
  return {code, body: asJson(ex)};
}

export default function ApiExplorer({
  item,
  infoPath,
}: {
  item: NonNullable<ApiItem>;
  infoPath: string;
}): React.JSX.Element {
  const metadata = useDoc();
  const {mask_credentials} = metadata.frontMatter as {
    mask_credentials?: boolean;
  };

  // The upstream Server component (removed with the explorer) is what seeds the
  // store's server value; without it, code samples fall back to the page origin
  // (docs.verificahub.ru). Seed it here so {{baseUrl}} resolves to the API host.
  const dispatch = useTypedDispatch();
  const serverValue = useTypedSelector((state: any) => state.server?.value);
  const serverOptions = useTypedSelector((state: any) => state.server?.options);
  React.useEffect(() => {
    if (serverValue) return;
    const option =
      (Array.isArray(serverOptions) && serverOptions[0]) ||
      (item as any).servers?.[0];
    if (option) dispatch(setServer(JSON.stringify(option)));
  }, [dispatch, serverValue, serverOptions, item]);
  const postman = new sdk.Request(
    item.postman
      ? sdk.Request.isRequest(item.postman)
        ? item.postman.toJSON()
        : item.postman
      : {},
  );

  const codeSnippetProps: any = {
    postman,
    codeSamples: (item as any)['x-codeSamples'] ?? [],
    maskCredentials: mask_credentials,
    requestBody: item.requestBody,
  };

  const requestExample = getRequestExample(item);
  const responseExample = getResponseExample(item);

  return (
    <>
      <SecuritySchemes infoPath={infoPath} />

      {item.method !== 'event' && (
        <section className="vh-api-sample">
          <div className="vh-api-sample__title">Пример запроса</div>
          {requestExample && (
            <>
              <div className="vh-api-sample__sublabel">Тело запроса</div>
              <CodeBlock language="json">{requestExample}</CodeBlock>
            </>
          )}
          <CodeSnippets {...codeSnippetProps} />
        </section>
      )}

      {responseExample && (
        <section className="vh-api-sample">
          <div className="vh-api-sample__title">
            Пример ответа
            <span className="vh-api-sample__status">{responseExample.code}</span>
          </div>
          <CodeBlock language="json">{responseExample.body}</CodeBlock>
        </section>
      )}
    </>
  );
}
