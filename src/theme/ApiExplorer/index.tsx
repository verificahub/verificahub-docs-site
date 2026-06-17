import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CodeSnippets from '@theme/ApiExplorer/CodeSnippets';
import SecuritySchemes from '@theme/ApiExplorer/SecuritySchemes';
import type {ApiItem} from 'docusaurus-plugin-openapi-docs/src/types';
import * as sdk from 'postman-collection';

/**
 * Swizzled (ejected) API explorer. The upstream theme also renders an
 * interactive "try-it" Request form (Base URL / Auth / Body) and a live
 * Response panel; we intentionally drop both for a cleaner, docs-first page —
 * the right rail is just the auth summary + the request code sample
 * (cURL/Go/Node/…). Response shapes/examples still live in the left column.
 */
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

  return (
    <>
      <SecuritySchemes infoPath={infoPath} />
      {item.method !== 'event' && <CodeSnippets {...codeSnippetProps} />}
    </>
  );
}
