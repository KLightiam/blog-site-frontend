# Kabah’s Blog: frontend

The reading site for Kabah Atawoge’s blog: stories on technology, travel, lifestyle and photography. It shows the latest stories, full articles, topics and contact details, and reads its content from [blog-site-backend](https://github.com/KLightiam/blog-site-backend).

## Pages

- **Stories** (`/`): the newest post as a lead story, the next six as cards, and links to every topic.
- **Story** (`/blog/:id`): the full article with category, date, reading time, cover image, tags and a copy-link button.
- **Categories** (`/categories`): every topic with published stories, searchable.
- **Category** (`/categories/:name/posts`): the stories in one topic.
- **About** and **Contact**: the contact form opens the visitor’s email app with their message filled in, since the blog has no mail server.

Every page has loading, empty and error states, works on phones, and follows the reader’s light or dark system setting.

## Running it

Start the backend first (it listens on port 3000 by default), then:

```sh
npm install
npm run dev
```

The API address defaults to `http://localhost:3000`. To use a deployed backend, copy `.env.example` to `.env` and set `VITE_API_URL`.

```sh
npm run lint
npm run build    # production build in dist/
```

## Tech

React 19, React Router 7, Tailwind CSS 4, Lucide icons and Vite. Newsreader (headlines and article text) and Figtree (interface) are self-hosted through Fontsource. Colours are CSS variables in `src/index.css`, with a dark palette in the same file.

## API used

| Path | Used for |
| --- | --- |
| `GET /api/v1/trendingposts?limit=7` | Latest published stories |
| `GET /api/v1/posts/:id` | One story |
| `GET /api/v1/categories` | Topics with their post IDs |
| `GET /api/v1/:category/posts` | Stories in a topic (404 when it has none) |
