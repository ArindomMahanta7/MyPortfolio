const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const getPagination = (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, total = 0) => {
  page = Math.max(Number(page) || DEFAULT_PAGE, 1);

  limit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  total = Math.max(Number(total) || 0, 0);

  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1
  };
};

export default getPagination;