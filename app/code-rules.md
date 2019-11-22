# Coding rules+

## Markdown

1. One line per sentence
1. No width limit / artificial line breaks
1. As little HTML as possible

## Firestore Rules

1. Least rights principle; provide access only if required for an existing feature
1. Limit `list` query responses with `request.query.limit <= 10`
