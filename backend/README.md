# Dawn Eats �

Dawn Eats � API ��� FastAPI � Python ��

## �/

- **Python**: 3.12+
- **FastAPI**: ���'� Web F�
- **SQLAlchemy**: ORM F� (v2.0)
- **SQLite**: pn� ( ѯ�)
- **JWT**: ����
- **uv**: Python �h

## � �

### ���B

- Python 3.12+
- uv �h
- SQLite 3

### �ŝV

```bash
# �� uv (��*��)
pip install uv

# ��y�V
uv sync
```

### /� ��h

```bash
# /� FastAPI  ��h
uv run uvicorn main:app --reload

# ���/�
uv run uvicorn main:app --reload --port 8080
```

�/���

- **API �**: http://localhost:8000
- **API �c**: http://localhost:8000/docs (Swagger UI)
- **e���**: http://localhost:8000/health

### pn��

```bash
# pn���
uv run alembic revision --autogenerate -m "��"

# �(pn���
uv run alembic upgrade head

# �SM���
uv run alembic current
```

## y�ӄ

```
backend/
   app/
      routers/        # API �1!W
         users.py    # (7���
         posts.py    # ����
         recipes.py  # �1���
      models.py       # SQLAlchemy pn!�
      schemas.py      # Pydantic �B/͔!
      database.py     # pn�ޥMn
      auth.py         # JWT ���w
   main.py            # FastAPI �(e�
   pyproject.toml     # y�Mn��V
   uv.lock           # �V���
   dawn_eats.db      # SQLite pn��� (�)
```

## 8ß�

### (7�
- (7茌{U
- JWT ����
- �����
- (7D��

### ��
- �����
- /�G URL
- u��
- (7sT

### �1�
- ����1
- �Ph�
- 6\e��
- %{�o�U

## API �c

/���� http://localhost:8000/docs ��t� API �c

;��

- `GET /health` - e���
- `POST /api/v1/users/register` - (7�
- `POST /api/v1/users/login` - (7{U
- `GET /api/v1/users/profile` - ��(7D�
- `GET /api/v1/posts/` - ����h
- `POST /api/v1/posts/` - ���
- `GET /api/v1/recipes/` - ���1h
- `POST /api/v1/recipes/` - ��1

##  ��

### ��

- ( Black <�
- u� PEP 8 �<W
- H({��:
- e�pH

### ����

� `.env` ��Mn����

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./dawn_eats.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### pn���

8�pn!�

- **User**: (7�o (id, username, email, password_hash)
- **Post**: �� (id, title, description, image_url, user_id)
- **Recipe**: �1�o (id, title, description, ingredients, instructions, nutrition_info, user_id)

s���
- User -> Posts ( �)
- User -> Recipes ( �)

## �r

���r��� [�rW](../docs/DEPLOYMENT.md)

## !.

"�Ф Issue � Pull Request�H� [!.W](../docs/CONTRIBUTING.md)

## ���

MIT License