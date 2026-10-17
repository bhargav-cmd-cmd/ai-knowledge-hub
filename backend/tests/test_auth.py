def test_register_and_login(client):
    r = client.post("/api/auth/register", json={"email": "a@test.com", "password": "secret123", "full_name": "A"})
    assert r.status_code == 201
    token = r.json()["access_token"]
    assert token

    r = client.post("/api/auth/login", json={"email": "a@test.com", "password": "secret123"})
    assert r.status_code == 200
    assert r.json()["access_token"]

    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "a@test.com"


def test_login_invalid(client):
    client.post("/api/auth/register", json={"email": "b@test.com", "password": "secret123"})
    r = client.post("/api/auth/login", json={"email": "b@test.com", "password": "wrong"})
    assert r.status_code == 401


def test_duplicate_register(client):
    client.post("/api/auth/register", json={"email": "c@test.com", "password": "secret123"})
    r = client.post("/api/auth/register", json={"email": "c@test.com", "password": "secret123"})
    assert r.status_code == 400
