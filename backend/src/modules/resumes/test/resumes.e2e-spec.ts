import * as fs from "fs-extra";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "../../../app.module";
import { JwtGuard } from "../../../auth/guard";
import { mockJwtGuard } from "../../../util/test/mockJwtGuard";
import { DepartmentsService } from "../../departments/departments.service";
import { ResumesService } from "../resumes.service";

describe("resumes module", () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let departmentsService: DepartmentsService;
  let resumesService: ResumesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    sequelize = module.get<Sequelize>(Sequelize);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    resumesService = module.get<ResumesService>(ResumesService);

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    fs.readdir("upload", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(`upload/${file}`, (err) => {
          if (err) throw err;
        });
      }
    });
    await sequelize.dropAllSchemas({ logging: false });
    await sequelize.sync();
    await app.close();
  });

  const createDepartment = async () => {
    await departmentsService.create({
      description: "Test 01",
      name: "Test 01",
    });
  };
  const createResume01 = async () => {
    await request(app.getHttpServer())
      .post("/resumes")
      .field("email", "test@test.com")
      .field("iDepartment", "1")
      .field("name", "Test")
      .field("phone", "(00) 00000-0000")
      .attach("file", fs.createReadStream("src/util/test/testFile.pdf"));
  };

  describe("/resumes (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should get resumes list with 1 resume", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes?page=1&limit=10");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it("should get resumes list with name and iDepartment", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes?page=1&limit=10&name=Test&iDepartment=1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it("should get resumes list with name", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes?page=1&limit=10&name=Test");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it("should get resumes list with iDepartment", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes?page=1&limit=10&iDepartment=1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it("should get resumes list without any resume", async () => {
      const response = await request(app.getHttpServer()).get("/resumes?page=1&limit=10");

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });

  describe("/resumes/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should get data from resume id 1", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.email).toEqual("test@test.com");
    });

    it("should try to get data from resume with an invalid id", async () => {
      const response = await request(app.getHttpServer()).get("/resumes/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Currículo não encontrado");
    });
  });

  describe("/resumes/file/:id (GET)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should get file from resume id 1", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).get("/resumes/file/1");

      expect(response.statusCode).toEqual(200);
    });

    it("should try to get file from an invalid resume", async () => {
      const response = await request(app.getHttpServer()).get("/resumes/file/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Currículo não encontrado");
    });
  });

  describe("/resumes (POST)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should create a new resume", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer())
        .post("/resumes")
        .field("email", "test@test.com")
        .field("iDepartment", "1")
        .field("name", "Test")
        .field("phone", "(00) 00000-0000")
        .attach("file", fs.createReadStream("src/util/test/testFile.pdf"));

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual("Currículo cadastrado com sucesso");
      expect(validation.id).toEqual(1);
      expect(validation.email).toEqual("test@test.com");
    });

    it("should try to create a new resume with an invalid department", async () => {
      const response = await request(app.getHttpServer())
        .post("/resumes")
        .field("email", "test@test.com")
        .field("iDepartment", "1")
        .field("name", "Test")
        .field("phone", "(00) 00000-0000")
        .attach("file", fs.createReadStream("src/util/test/testFile.pdf"));

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
    });

    it("should try to create a new resume with an invalid file type", async () => {
      await createDepartment();

      const response = await request(app.getHttpServer())
        .post("/resumes")
        .field("email", "test@test.com")
        .field("iDepartment", "1")
        .field("name", "Test")
        .field("phone", "(00) 00000-0000")
        .attach("file", fs.createReadStream("src/util/test/testFile.txt"));

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Somente arquivos no formato PDF são permitidos");
    });
  });

  describe("/resumes/:id (DELETE)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should delete the resume id 1", async () => {
      await createDepartment();
      await createResume01();

      const response = await request(app.getHttpServer()).delete("/resumes/1");

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Currículo excluído com sucesso");
    });

    it("should try to delete an invalid resume", async () => {
      const response = await request(app.getHttpServer()).delete("/resumes/1");

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Currículo não encontrado");
    });
  });

  describe("/resumes/:id (PATCH)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should update resume id 1", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        observations: "Test",
      };

      const response = await request(app.getHttpServer()).patch("/resumes/1").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Currículo alterado com sucesso");
      expect(validation.observations).toEqual(data.observations);
    });

    it("should try to update resume with an invalid department id", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        iDepartment: 2,
      };

      const response = await request(app.getHttpServer()).patch("/resumes/1").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.iDepartment).toEqual(1);
    });

    it("should try to update resume with an invalid id", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        observations: "Test 02",
      };

      const response = await request(app.getHttpServer()).patch("/resumes/2").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Currículo não encontrado");
      expect(validation.observations).toEqual(null);
    });
  });

  describe("/resumes/:id (PUT)", () => {
    beforeEach(async () => {
      await sequelize.dropAllSchemas({ logging: false });
      await sequelize.sync();

      fs.readdir("upload", (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(`upload/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    it("should update resume id 1", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        iDepartment: 1,
        observations: "Test",
        revised: true,
      };

      const response = await request(app.getHttpServer()).put("/resumes/1").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("Currículo alterado com sucesso");
      expect(validation.iDepartment).toEqual(1);
      expect(validation.observations).toEqual(data.observations);
      expect(validation.revised).toEqual(data.revised);
    });

    it("should try to update resume with an invalid department id", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        iDepartment: 2,
        observations: "Test",
        revised: true,
      };

      const response = await request(app.getHttpServer()).put("/resumes/1").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Departamento não encontrado");
      expect(validation.iDepartment).toEqual(1);
      expect(validation.observations).toEqual(null);
    });

    it("should try to update resume with an invalid id", async () => {
      await createDepartment();
      await createResume01();

      const data = {
        iDepartment: 1,
        observations: "Test",
        revised: true,
      };

      const response = await request(app.getHttpServer()).put("/resumes/2").send(data);

      const validation = await resumesService.data(1);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("Currículo não encontrado");
      expect(validation.observations).toEqual(null);
    });
  });
});
