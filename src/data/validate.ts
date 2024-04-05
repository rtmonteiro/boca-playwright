import { z } from 'zod';
import { type SetupModel } from './setup';

export class Validate {
  private readonly loginSystemSchema = z.object({
    logins: z.object({
      system: z.object({
        username: z.string(),
        password: z.string()
      })
    })
  });

  private readonly createContestSchema = z.object({
    contests: z.array(z.object({
      setup: z.object({
        name: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        stopAnswering: z.number().optional(),
        stopScoreboard: z.number().optional(),
        penalty: z.number().optional(),
        maxFileSize: z.number().optional(),
        mainSiteUrl: z.string().optional(),
        mainSiteNumber: z.number(),
        localSiteNumber: z.number().optional(),
        active: z.boolean()
      })
    }))
  });

  private readonly updateContestSchema = this.createContestSchema
    .extend({
      contests: z.array(z.object({
        setup: z.object({
          id: z.number()
        })
      }))
    });

  private readonly clearContestSchema = z.object({
    contests: z.array(z.object({
      setup: z.object({
        id: z.number()
      })
    }))
  });

  private readonly createUsersSchema = z.object({
    user: z.object({
      userSiteNumber: z.number().optional(),
      userNumber: z.string(),
      userName: z.string(),
      userType: z.union([
        z.literal('Team'),
        z.literal('Judge'),
        z.literal('Admin'),
        z.literal('Staff'),
        z.literal('Score'),
        z.literal('Site')
      ]),
      userFullName: z.string(),
      userDesc: z.string()
    })
  });

  private readonly loginAdminSchema = z.object({
    logins: z.object({
      admin: z.object({
        username: z.string(),
        password: z.string()
      })
    })
  });

  private readonly insertUsersSchema = z.object({
    setup: z.object({
      userPath: z.string()
    })
  });

  private readonly deleteUserSchema = z.object({
    user: z.object({
      userName: z.string()
    })
  });

  constructor (public setup: SetupModel) {}

  loginSystem (): void {
    this.loginSystemSchema.parse(this.setup);
  }

  loginAdmin (): void {
    this.loginAdminSchema.parse(this.setup);
  }

  createContest (): void {
    this.createContestSchema.parse(this.setup);
  }

  updateContest (): void {
    this.updateContestSchema.parse(this.setup);
  }

  clearContest (): void {
    this.clearContestSchema.parse(this.setup);
  }

  createUser (): void {
    this.createUsersSchema.parse(this.setup);
  }

  insertUsers (): void {
    this.insertUsersSchema.parse(this.setup);
  }

  deleteUser (): void {
    this.deleteUserSchema.parse(this.setup);
  }
}
