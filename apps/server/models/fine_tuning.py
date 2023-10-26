from __future__ import annotations

import uuid

from sqlalchemy import UUID, Boolean, Column, ForeignKey, String
from sqlalchemy.orm import Session, relationship
from sqlalchemy.sql import or_

from exceptions import FineTuningNotFoundException
from models.base_model import BaseModel
from typings.fine_tuning import FineTuningInput


class FineTuningModel(BaseModel):
    """
    Model representing a fine-tuning.

    Attributes:
        id (UUID): The primary key of the fine-tuning.
        account_id (UUID): The ID of the account associated with the configuration.
        workspace_id (UUID): The ID of the project associated with the configuration.
        is_deleted (Boolean): Whether the fine-tuning is deleted.
    """

    __tablename__ = "fine_tuning"

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)

    identifier = Column(String)  # fine-tuning identifier

    name = Column(String)

    status = Column(String)

    file_url = Column(String)  # CSV or JSONL file

    model_id = Column(UUID)

    account_id = Column(
        UUID, ForeignKey("account.id", ondelete="CASCADE"), nullable=True
    )

    workspace_id = Column(
        UUID, ForeignKey("workspace.id", ondelete="CASCADE"), nullable=True, index=True
    )

    is_deleted = Column(Boolean, default=False, index=True)

    created_by = Column(
        UUID,
        ForeignKey("user.id", name="fk_created_by", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    modified_by = Column(
        UUID,
        ForeignKey("user.id", name="fk_modified_by", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    creator = relationship("UserModel", foreign_keys=[created_by], lazy="select")

    def __repr__(self) -> str:
        return (
            f"FineTuning(id={self.id}, "
            f"is_deleted={self.is_deleted}, account_id={self.account_id})"
        )

    @classmethod
    def create_fine_tuning(
        cls, session: Session, run: FineTuningInput, user_id: UUID, account_id: UUID
    ):
        """
        Creates a new fine-tuning model with the provided configuration.

        Args:
            db: The database object.
            config_with_config: The object containing the run and configuration details.

        Returns:
            Run: The created run.

        """
        db_fine_tuning = FineTuningModel(
            created_by=user_id,
            account_id=account_id,
        )

        cls.update_model_from_input(db_fine_tuning, run)

        session.add(db_fine_tuning)
        session.flush()  # Flush pending changes to generate the config's ID
        session.commit()

        return db_fine_tuning

    @classmethod
    def update_fine_tuning(
        cls,
        session: Session,
        id: UUID,
        input: FineTuningInput,
        user_id: UUID,
        account_id: UUID,
    ) -> FineTuningModel:
        """
        Updates a fine-tuning with the provided configuration.

        Args:
            db: The database object.
            datasource_with_config: The object containing the fine-tuning and configuration details.

        Returns:
            FineTuning: The updated fine-tuning.

        """
        fine_tuning_model = cls.get_fine_tuning_by_id(session, id, account_id)

        if not fine_tuning_model:
            raise FineTuningNotFoundException("Fine-tuning not found")

        fine_tuning_model = cls.update_model_from_input(
            fine_tuning_model=fine_tuning_model, fine_tuning_input=input
        )

        fine_tuning_model.modified_by = user_id

        session.add(fine_tuning_model)
        session.commit()

        return fine_tuning_model

    @classmethod
    def update_model_from_input(
        cls, fine_tuning_model: FineTuningModel, fine_tuning_input: FineTuningInput
    ):
        for field in FineTuningInput.__annotations__.keys():
            setattr(fine_tuning_model, field, getattr(fine_tuning_input, field))

        return fine_tuning_model

    @classmethod
    def get_fine_tunings(cls, session: Session, account_id: UUID):
        return (
            session.query(FineTuningModel)
            .filter(
                FineTuningModel.account_id == account_id,
                FineTuningModel.is_deleted.is_(False),
            )
            .all()
        )

    @classmethod
    def get_fine_tuning_by_id(cls, session: Session, id: UUID, account_id: UUID):
        """
        Get Datasource from datasource_id

        Args:
            session: The database session.
            datasource_id(int) : Unique identifier of an Datasource.

        Returns:
            Datasource: Datasource object is returned.
        """
        fine_tuning_model = (
            session.query(FineTuningModel)
            .filter(
                FineTuningModel.id == id,
                FineTuningModel.account_id == account_id,
                FineTuningModel.is_deleted.is_(False),
            )
            .first()
        )
        return fine_tuning_model

    @classmethod
    def delete_by_id(cls, session: Session, id: UUID, account_id: UUID):
        fine_tuning_model = (
            session.query(FineTuningModel)
            .filter(
                FineTuningModel.id == id,
                FineTuningModel.account_id == account_id,
                FineTuningModel.is_deleted.is_(False),
            )
            .first()
        )

        if not fine_tuning_model or fine_tuning_model.is_deleted:
            raise FineTuningNotFoundException("Fine-tuning not found")

        fine_tuning_model.is_deleted = True

        session.commit()